import React, { useState } from "react";
import SelectedUsers from "./SelectedUsers";
import WaitingUsers from "./WaitingUsers";
import Chat from "./Chat";

function Home() {
  const [waitingUsers, setWaitingUsers] = useState([]);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [activeUser, setActiveUser] = useState({});

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
          activeUser={activeUser}
          selectedUsers={selectedUsers}
          setActiveUser={setActiveUser}
          setSelectedUsers={setSelectedUsers}
        />
        <WaitingUsers
          setActiveUser={setActiveUser}
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
        <Chat activeUser={activeUser} selectedUsers={selectedUsers} />
      </div>
    </div>
  );
}

export default Home;
