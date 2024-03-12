import { wss } from "../Config/socket.config";

export function addMessage({
  message,
  sentBy = null,
  first = false,
  socketId = null,
}) {
  // Assuming you have a div with an id of 'myDiv'
  const myDiv = document.getElementById("connected-to");
  console.log("myDiv", myDiv);
  let newElem;
  // Create a new paragraph element
  if (first) {
    newElem = document.createElement("h3");
    newElem.textContent = `You are connected to ${socketId}`;
  } else {
    newElem = document.createElement("li");
    // newElem.
    newElem.textContent = `${sentBy} says: ${message}`;
  }

  // Append it as a child of the div
  myDiv.appendChild(newElem);
}

export function addSpeakingWith(message) {
  const myDiv = document.getElementById("speaking-with");
  let newElem;
  // Create a new paragraph element
  newElem = document.createElement("h3");
  newElem.data = JSON.stringify(message);
  newElem.id = "you-are-speaking-with";
  newElem.textContent = `You are speaking with ${message.userName} with ${message.userSocketId}`;
  myDiv.appendChild(newElem);
}

export function addSelectedUser(message) {
  console.log("SELECTED", message);
  const myDiv = document.getElementById("selected-active-users");
  let newElem;
  // Create a new paragraph element

  newElem = document.createElement("li");
  newElem.textContent = `${message.userName}`;
  newElem.data = JSON.stringify(message); // it is still user data
  newElem.id = `active-selected-${message.userName}-${message.brand}`;
  addSpeakingWith(JSON.parse(newElem.data));
  newElem.onclick = (event) => {
    console.log("event.target.id", event.target.id);
    console.log("event.target.data", event.target.data);
    addSpeakingWith(JSON.parse(newElem.data));

    // if()
  };
  // Append it as a child of the div
  myDiv.appendChild(newElem);
}

export function addWaitingUser(message) {
  // Assuming you have a div with an id of 'myDiv'
  const myDiv = document.getElementById("waiting-users-list");
  console.log("myDiv", myDiv);
  let newElem = document.createElement("li");
  // here i will still have user data
  newElem.textContent = `${message.userName}`;
  newElem.id = `waiting-${message.userSocketId}-${message.userName}-${message.brand}`;
  newElem.className = `ali-waiting-user`;

  // newElem.addEventListener("onclick", () => {

  // });
  newElem.onclick = () => {
    // console.log("first-->");
    console.log("WSS", wss);
    // wss.selectedUser(message);
    newElem.remove();
  };

  // Append it as a child of the div
  myDiv.appendChild(newElem);
}
