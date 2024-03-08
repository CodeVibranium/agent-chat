import React from "react";

function SelectedUsers({ selectedUsers, setSelectedUsers }) {
  return (
    <div>
      <h2>SelectedUsers</h2>
      <ol id="selected-active-users"></ol>
    </div>
  );
}

export default SelectedUsers;
