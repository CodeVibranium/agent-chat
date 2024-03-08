import React, { useState } from "react";
import SelectedUsers from "./SelectedUsers";
import WaitingUsers from "./WaitingUsers";
import Chat from "./Chat";

function Home() {
  const [waitingUsers, setWaitingUsers] = useState([]);
  const [selectedUsers, setSelectedUsers] = useState([]);

  return (
    <div
      style={{
        display: "flex",
        minWidth: "100%",
        minHeight: "95vh",
        gap: "20px",
      }}
    >
      <div
        style={{
          minWidth: "25%",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <SelectedUsers
          selectedUsers={waitingUsers}
          setSelectedUsers={setSelectedUsers}
        />
        <WaitingUsers
          waitingUsers={waitingUsers}
          setSelectedUsers={setSelectedUsers}
          setWaitingUsers={setWaitingUsers}
        />
      </div>
      <div
        style={{
          minWidth: "72%",
          justifySelf: "center",
          border: "2px solid black",
        }}
      >
        <Chat />
      </div>
    </div>
  );
}

export default Home;
