const { default: axios } = require("axios");
const express = require("express");
const http = require("http");
const socketIo = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "https://typing-nda.web.app",
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {
  io.emit("total_views", io.engine.clientsCount);

  socket.on("send_data", (text) => {
    const data = {
      text: text,
    };

    axios.post(
      "https://typing-nda-default-rtdb.firebaseio.com/Data.json",
      data
    );

    io.emit("send_data", text);
  });

  socket.on("typing", ([isTyping, userId]) => {
    io.emit("typing", [isTyping, userId]);
  });

  socket.on("disconnect", () => {
    io.emit("total_views", io.engine.clientsCount);
    io.emit("typing", [false, socket.id]);
  });
});

server.listen(3001, () => {
  console.log("Server aktif!");
  console.log("http://localhost:3001");
});
