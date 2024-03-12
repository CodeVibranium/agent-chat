import { io } from "socket.io-client";
import { addMessage, addSelectedUser, addWaitingUser } from "../Helpers/utils";
import EventEmitter from "events";

class CustomSocket {
  id = null;
  socket = null;
  emitter = null;
  active_users = [];
  waiting_users = [];
  agentName = null;
  agentBrand = null;
  static instance = null;
  deferredSubscriptions = [];

  constructor() {
    if (CustomSocket.instance) {
      throw new Error("Socket instance already created");
    }
    this.socket = null;
    this.emitter = new EventEmitter();
    CustomSocket.instance = this;
  }

  createSocket(connectionURI) {
    if (this.socket) {
      console.log("Socket already created");
      return this;
    }
    try {
      this.socket = io(connectionURI, {
        cors: { origin: "*" },
      });
      return this;
    } catch (error) {
      console.error("Failed to create socket:", error);
    }
  }

  connectSocket(message, callback) {
    return new Promise((resolve, reject) => {
      if (!this.socket) {
        reject("Socket not initialized");
        return;
      }

      this.socket.on("connect", () => {
        this.emitter.emit("connectionChanged", true);
        this.setupContinuousMessageReceiving();
        this.deferredSubscriptions.forEach(({ eventName, callback }) => {
          this.socket.on(eventName, callback);
        });
        callback();
        resolve(this);
      });

      // this.socket.on("disconnect", () => {
      //   this.emitter.emit("connectionChanged", false);
      // });

      this.socket.on("connect_error", (error) => {
        reject(error);
      });
    });
  }

  onConnectionChange(callback) {
    this.emitter.on("connectionChanged", callback);
  }

  registerAgent(message, callback) {
    return new Promise((resolve, reject) => {
      if (!this.socket) {
        reject("Socket not initialized");
        return;
      }
      this.agentName = message.name;
      this.agentBrand = message.brand;
      this.id = this.socket.id;
      // only brand name is required to join a room
      this.socket.emit("register-agent", message, callback);

      this.socket.on("connect_error", (error) => {
        reject(error);
      });
    });
  }

  sendMsg(message, room = "") {
    return new Promise((resolve, reject) => {
      if (!this.socket) {
        reject("Socket not initialized");
        return;
      } else {
        this.socket.emit(
          "send-message",
          {
            ...message,
            agentSocketId: this.socket.id,
            agentName: this.agentName,
          },
          room
        );
        resolve(this.socket.id);
      }

      this.socket.on("connect_error", (error) => {
        reject(error);
      });
    });
  }

  setupContinuousMessageReceiving() {
    this.socket.on("receive-msg", (msgSentFromServer) => {
      console.log("msgSentFromServer--agent", msgSentFromServer);
      addMessage({
        message: msgSentFromServer.message,
        sentBy: msgSentFromServer.userName,
      });
    });
  }

  waitingUsers(setWaitingUsers) {
    this.socket.on("waiting-users", (user) => {
      setWaitingUsers(user);
    });
  }

  removeWaitingUser(handleRemoveWaitingUsers) {
    this.socket.on("remove-waiting-user", (users) => {
      handleRemoveWaitingUsers(users);
    });
  }

  selectedUser(message) {
    message = {
      ...message,
      agentSocketId: this.id,
      agentName: this.agentName,
    };
    addMessage({
      message: message.message,
      sentBy: message.userName,
    });
    this.socket.emit("agent-selected-user", message, () => {});
  }

  initialWaitingUsersList(setWaitingUsers) {
    this.socket.on("update-waiting-users", (users) => {
      setWaitingUsers(users);
    });
  }

  // receiveMsg() {
  //   return new Promise((resolve, reject) => {
  //     if (!this.socket) {
  //       reject("Socket not initialized");
  //       return;
  //     } else {
  //       this.socket.on("receive-msg", (msgSentFromServer) => {
  //         addMessage({
  //           message: msgSentFromServer.message,
  //           sentBy: msgSentFromServer.userName,
  //         });
  //         resolve(this.socket.id);
  //       });
  //     }
  //     this.socket.on("connect_error", (error) => {
  //       reject(error);
  //     });
  //   });
  // }

  logoutAgent(user) {
    // used for agent logout
    if (this.socket) {
      this.socket.disconnect();
    }
  }

  closeUserSocket(handleSocketClosedByUser) {
    // when user closes the connection from his side
    this.socket.on("forward-disconnect", (user) => {
      handleSocketClosedByUser(user);
    });
  }

  disconnectSocket(data, handleSocketClosedByUser) {
    if (this.socket) {
      // when agent closes user connection
      this.socket.emit("end-connection", data, data.userSocketId);
      handleSocketClosedByUser(data);
    }
  }

  isConnected() {
    return this.socket && this.socket.connected;
  }

  getEmitter() {
    return this.emitter;
  }

  static getInstance(onMessageCallback) {
    if (!CustomSocket.instance) {
      CustomSocket.instance = new CustomSocket();
      return this;
      // CustomSocket.instance.connect(onMessageCallback).catch(console.error);
    }
    return CustomSocket.instance;
  }
}
export const wss = new CustomSocket();
