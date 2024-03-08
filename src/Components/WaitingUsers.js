import React, { useEffect, useState } from "react";
import "./Chat.css";
import { wss } from "../Config/socket.config";
function WaitingUsers({ waitingUsers, setWaitingUsers, setSelectedUsers }) {
  useEffect(() => {
    // wss
  }, []);

  return (
    <div>
      <h2>WaitingUsers</h2>
      <ol id="waiting-users-list">
        {waitingUsers.map((user) => (
          <li
            onClick={() => {
              setWaitingUsers((prev) => [
                ...prev.filter((each) => each.userName !== user.userName),
              ]);
              setSelectedUsers((prev) => [...prev, user]);
            }}
          >
            {user.userName}
          </li>
        ))}
      </ol>
    </div>
  );
}

export default WaitingUsers;
