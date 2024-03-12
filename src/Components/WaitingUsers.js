import React from "react";
import "./Chat.css";
import { wss } from "../Config/socket.config";
function WaitingUsers({
  waitingUsers,
  setWaitingUsers,
  setSelectedUsers,
  setActiveUser,
}) {
  const emitter = wss.getEmitter();
  emitter.on("connectionChanged", (connection) => {
    if (connection) {
      const updateWaitingUsersState = (user) => {
        if (Array.isArray(user)) {
          setWaitingUsers((prev) => [...prev, ...user]);
        } else {
          setWaitingUsers((prev) => [...prev, user]);
        }
      };
      const handleRemoveWaitingUsers = (users) => {
        setWaitingUsers(users);
      };
      wss.waitingUsers(updateWaitingUsersState);
      wss.initialWaitingUsersList(updateWaitingUsersState);
      wss.removeWaitingUser(handleRemoveWaitingUsers);
    }
  });
  return (
    <div>
      <h2>{waitingUsers.length > 0 ? "Waiting users" : "No waiting users"}</h2>
      <ol id="waiting-users-list-1">
        {waitingUsers.map((user) => (
          <li
            key={user.userSocketId}
            id={user.userSocketId}
            onClick={() => {
              setWaitingUsers((prev) => [
                ...prev.filter((each) => each.userName !== user.userName),
              ]);
              setSelectedUsers((prev) => [
                ...prev,
                {
                  ...user,
                  // agentSocketId: wss.id, agentName: wss.agentName
                },
              ]);
              setActiveUser(user);
              wss.selectedUser(user);
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
