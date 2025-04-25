import { io } from "socket.io-client";

let socket;

export function initializeSocket(token) {
  if (!socket) {
    socket = io("http://localhost:3000", {
      autoConnect: false,
      auth: { token }, 
    });
  }
  return socket;
}

export function connectSocket() {
  if (socket && !socket.connected) {
    socket.connect();
  }
}

export function disconnectSocket() {
  if (socket && socket.connected) {
    socket.disconnect();
  }
}

export function sendMessage({ recipientId, content }) {
  if (socket) {
    socket.emit("send_message", { recipientId, content });
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