const express = require("express");
const socketIo = require("socket.io");
const http = require("http");
const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    credentials: true,
  },
});

module.exports = { io };
