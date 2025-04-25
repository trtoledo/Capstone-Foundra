require('dotenv').config();
const express = require("express");
const cors = require('cors');
const { createServer } = require("http");
const { Server } = require("socket.io");
const { client } = require('./db');
const { verify } = require('jsonwebtoken');

const app = require('./app');
const PORT = process.env.PORT || 3000;

const httpServer = createServer(app);

const io = new Server(httpServer, {
  cors: {
    origin: ["http://localhost:3000", "http://localhost:5173"],
  }
});

const connectedUsers = {};

io.use((socket, next) => {
  const token = socket.handshake.auth.token; 
  
  if (!token) {
    return next(new Error("Authentication error: No token provided"));
  }

  try {
    const decoded = verify(token, process.env.JWT_SECRET);
    socket.userId = decoded.userId;
    next();
  } catch (err) {
    next(new Error("Authentication error: Invalid token"));
  }
});

io.on("connection", (socket) => {
  console.log(`⚡ User connected: ${socket.id}`);

  socket.on("join", (userId) => {
    connectedUsers[userId] = socket.id;
    console.log(`User ${userId} joined with socket ID ${socket.id}`);
  });

  socket.on("send_message", async ({ recipientId, content }) => {
    try {
      const senderId = socket.userId;

      const message = await client.message.create({
        data: {
          senderId,
          recipientId,
          content,
        }
      });

      const recipientSocketId = connectedUsers[recipientId];
      if (recipientSocketId) {
        io.to(recipientSocketId).emit("receive_message", message);
      }

      socket.emit("receive_message", message);

    } catch (err) {
      console.error("Error handling send_message:", err.message);
      socket.emit("error", { error: "Failed to send message" });
    }
  });

  socket.on("disconnect", () => {
    console.log(`🚫 User disconnected: ${socket.id}`);
    for (const [userId, sockId] of Object.entries(connectedUsers)) {
      if (sockId === socket.id) {
        delete connectedUsers[userId];
        break;
      }
    }
  });
});

httpServer.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});