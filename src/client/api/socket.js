import { io } from "socket.io-client";

let socket;

export function initializeSocket(token) {
  if (!socket) {
    socket = io("http://localhost:3000", {
      autoConnect: false, 
    });
  }
  return socket;
}

export function connectSocket(token) {
  if (socket && !socket.connected) {
    socket.auth = { token };
    socket.connect();
    socket.emit("join", localStorage.getItem("id"));
  }
}

export function disconnectSocket() {
  if (socket && socket.connected) {
    socket.disconnect();
  }
}

export function sendMessage({ recipientId, content, senderId }) {
  if (socket) {
    socket.emit("send_message", { recipientId, content, senderId });
  }
}

export function onMessageReceived(callback) {
  if (socket) {
    socket.on("receive_message", callback);
  }
}

export function offMessageReceived(callback) {
  if (socket) {
    socket.off("receive_message", callback);
  }
}

export { socket };