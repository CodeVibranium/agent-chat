import React from "react";

function SelectedUsers({ selectedUsers, setSelectedUsers, setActiveUser }) {
  return (
    <div>
      {selectedUsers.length > 0 ? (
        <>
          <h2>SelectedUsers</h2>
          <ol id="selected-active-users">
            {/* TODO: implement the chat end both client and agent */}
            {selectedUsers.map((user) => (
              <li onClick={() => setActiveUser(user)}>{user.userName}</li>
            ))}
          </ol>
        </>
      ) : (
        <h2>No active users</h2>
      )}
    </div>
  );
}

export default SelectedUsers;
