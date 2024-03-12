import React, { useRef, useState } from "react";
import * as superheroes from "superheroes";
import { wss } from "../Config/socket.config";

function Chat({ activeUser, selectedUsers }) {
  const [isSocketConnected, setSocketConnected] = useState(false);
  const [loading, setLoading] = useState({
    status: false,
    socketId: null,
  });
  const [userData, setUserData] = useState({});
  const [disconnectedUsers, setDisconnectedUsers] = useState({});
  const userName = useRef(null);

  async function handleSendMessage() {
    const input = document.getElementById("message");
    const val = input.value;
    input.value = "";
    wss.sendMsg({ ...activeUser, message: val }, activeUser.userSocketId);
  }

  const emitter = wss.getEmitter();
  emitter.on("connectionChanged", (connection) => {
    if (connection) {
      wss.closeUserSocket(handleSocketClosedByUser);
    }
  });
  function handleSocketClosedByUser(user) {
    setDisconnectedUsers((prev) => ({ ...prev, [user.userSocketId]: user }));
  }

  async function handleRegisterAgent() {
    const input = document.getElementById("message");
    if (!isSocketConnected) {
      setLoading({ status: true, socketId: null });
      userName.current = superheroes.random();
      wss
        .createSocket("http://localhost:3001")
        .connectSocket(
          {
            sentBy: userName.current,
            message: input.value,
            first: true,
          },
          () => setSocketConnected(true)
        )
        .then((res) => {
          res.registerAgent(
            {
              name: userName.current,
              sentBy: userName.current,
              message: "AGENT is ready",
              first: true,
              brand: "Samsung",
            },
            (socketId) => {
              console.log("AGENT connected successfully");
              setLoading({ loading: false, socketId });
            }
          );
        });
    } else {
      const chat = document.getElementById("chat-messages");
      const message = JSON.parse(chat.data);
      wss.sendMsg(
        {
          ...message,
          message: input.value,
        },
        message.userSocketId
      );
    }
  }

  function handleAgentLogout(activeUser) {
    if (!(selectedUsers.length > 0 && Object.keys(activeUser).length > 0)) {
      wss.disconnectSocket(activeUser);
      // TODO:agent logout logic
    } else {
      alert("Please end all selected users chat & logout");
    }
  }
  return (
    <>
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          gap: "10px",
          alignItems: "center",
        }}
      >
        <h2 style={{ display: "inline-block" }}>Chat</h2>

        {isSocketConnected ? (
          <button onClick={handleAgentLogout}>LOGOUT</button>
        ) : (
          <button onClick={handleRegisterAgent}>LOGIN</button>
        )}
        {/* TODO: if user has no active chats u can allow him to logout */}
      </div>
      {isSocketConnected && (
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            padding: "0 10px",
          }}
        >
          <h3>client: {activeUser?.userName || "No one"}</h3>
          <h3>Connected as: {loading.socketId || "Not connected"}</h3>
        </div>
      )}
      {/* TODO: need to remove disconnected users from redis */}
      {disconnectedUsers?.[activeUser.userSocketId] ? (
        <>
          <h4>{activeUser.userName} has disconnected</h4>
        </>
      ) : (
        <div
          style={{
            position: "absolute",
            bottom: "20px",
            minWidth: "60%",
          }}
        >
          <input
            id="message"
            type="text"
            placeholder="Send a message"
            style={{ minWidth: "80%", padding: "10px" }}
          />
          <button
            style={{
              minHeight: "100%",
              padding: "10px",
              marginLeft: "10px",
              background: "#0066b2",
            }}
            onClick={handleSendMessage}
          >
            Submit
          </button>
          <button
            style={{
              minHeight: "100%",
              padding: "10px",
              marginLeft: "20px",
              background: "#BA0021",
            }}
            onClick={() => {
              wss.disconnectSocket(activeUser, handleSocketClosedByUser);
            }}
          >
            End
          </button>
          <br />
          <br />
        </div>
      )}
    </>
  );
}

export default Chat;
