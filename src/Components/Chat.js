import React, { useRef, useState } from "react";
import * as superheroes from "superheroes";
import { wss } from "../Config/socket.config";

function Chat() {
  const [isSocketConnected, setSocketConnected] = useState(false);
  const [loading, setLoading] = useState(false);
  const [userData, setUserData] = useState({});
  const userName = useRef(null);

  async function handleSendMessage() {
    const input = document.getElementById("message");
    const elem = document.getElementById("you-are-speaking-with");
    const message = JSON.parse(elem.data);
    console.log("message-->1", message);
    wss.sendMsg({ ...message, message: input.value }, message.userSocketId);
  }

  async function handleRegisterAgent() {
    const input = document.getElementById("message");
    if (!isSocketConnected) {
      userName.current = superheroes.random();
      console.log("AGENT: wss--->", wss);
      // wss.connectSocket()
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
          console.log("AGENT RES--->", res);
          res.registerAgent(
            {
              agentName: userName.current,
              sentBy: userName.current,
              message: "AGENT is ready",
              first: true,
              brand: "Samsung",
            },
            () => {
              console.log("AGENT connected successfully");
              setLoading(false);
            }
          );
        });
    } else {
      const chat = document.getElementById("chat-messages");
      const message = JSON.parse(chat.data);
      console.log("message-2", message);
      wss.sendMsg(
        {
          ...message,
          message: input.value,
        },
        message.userSocketId
      );
    }
  }
  return (
    <>
      <div
        style={{
          alignItems: "center",
          justifyContent: "center",
          gap: "10px",
          display: isSocketConnected ? "none" : "flex",
        }}
      >
        <h2 style={{ display: "inline-block" }}>Chat</h2>
        <button onClick={handleRegisterAgent}>LOGIN</button>
      </div>
      <ul id="speaking-with"></ul>
      <div id="connected-to"></div>

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
          style={{ minHeight: "100%", padding: "10px", marginLeft: "10px" }}
          onClick={handleSendMessage}
        >
          Submit
        </button>
        <br />
        <br />
      </div>
    </>
  );
}

export default Chat;
