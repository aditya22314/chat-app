import { Server } from "socket.io";
import express from "express";

import http from "http";

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: ["http://localhost:5173", "http://localhost:5174"],
    credentials: true,
  },
});

// allow one user to have multiple socket connections (multiple tabs/devices)
const userSocketMap = {};

export function getReceiverSocketIds(userId) {
  return userSocketMap[userId] || [];
}

io.on("connection", (socket) => {
  console.log("A user connected", socket.id);
  const userId = socket.handshake.query.userId;

  if (userId) {
    userSocketMap[userId] = [
      ...new Set([...(userSocketMap[userId] || []), socket.id]),
    ];
  }

  io.emit("getOnlineUsers", Object.keys(userSocketMap));

  socket.on("disconnect", (reason) => {
    console.log("A user disconnected", socket.id, reason);

    if (userId && userSocketMap[userId]) {
      userSocketMap[userId] = userSocketMap[userId].filter(
        (id) => id !== socket.id,
      );

      if (userSocketMap[userId].length === 0) {
        delete userSocketMap[userId];
      }
    }

    io.emit("getOnlineUsers", Object.keys(userSocketMap));
  });
});

export { io, app, server };
