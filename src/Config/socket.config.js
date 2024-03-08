import { io } from "socket.io-client";
import { addMessage, addWaitingUser } from "../Helpers/utils";
import * as superheroes from "superheroes";

class CustomSocket {
  static instance = null;
  socket = null;
  id = null;
  agentName = "SHAHED";
  waiting_users = [];
  active_users = [];

  constructor() {
    if (CustomSocket.instance) {
      throw new Error("Socket instance already created");
    }
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
        console.log("Connected to server", this.socket.id);
        addMessage({ ...message, socketId: this.socket.id });
        this.setupContinuousMessageReceiving();
        this.waitingUsers();
        callback();
        resolve(this);
      });

      this.socket.on("connect_error", (error) => {
        reject(error);
      });
    });
  }

  registerAgent(message, callback) {
    return new Promise((resolve, reject) => {
      if (!this.socket) {
        reject("Socket not initialized");
        return;
      }
      this.agentName = message.agentName;
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
          { ...message, agentSocketId: this.socket.id },
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

  waitingUsers() {
    this.socket.on("waiting-users", (user) => {
      console.log("WAITING USERS--->", user);
      this.waiting_users.push(user);
      // setState((prev) => [...prev, user]);
      addWaitingUser({
        ...user,
        agentSocketId: this.socket.id,
        agentName: this.agentName,
      });
    });
  }

  receiveMsg() {
    return new Promise((resolve, reject) => {
      if (!this.socket) {
        reject("Socket not initialized");
        return;
      } else {
        this.socket.on("receive-msg", (msgSentFromServer) => {
          console.log(msgSentFromServer);
          addMessage({
            message: msgSentFromServer.message,
            sentBy: msgSentFromServer.userName,
          });
          resolve(this.socket.id);
        });
      }
      this.socket.on("connect_error", (error) => {
        reject(error);
      });
    });
  }

  listenEvent(eventName, id, callback) {
    return new Promise((resolve, reject) => {
      this.socket.emit("start", id, () => {
        console.log("Started to server", id);
      });

      console.log(eventName);
      this.socket.on(eventName, (data) => {
        console.log(data, "dksnfls");
        callback(data);
        resolve();
      });
    });
  }

  closeSocket(id) {
    console.log(id, ";sljd");
    if (this.socket) {
      this.socket
        .emit("stop", id, () => {
          console.log("Socket stopped");
        })
        .on("error", (error) => {
          console.error("Socket emit error:", error);
        });
      this.disconnectSocket();
    }
  }

  disconnectSocket() {
    if (this.socket) {
      console.log("in disconnect");
      this.socket.on("disconnect", () => {
        console.log("Socket disconnected");
      });
    }
  }

  allWaitingUsers() {
    return this.waiting_users;
  }

  getSocket() {
    return this.socket;
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
