const express = require('express');
require('dotenv').config();
const { Server } = require('socket.io');
const { createServer } = require('http');
const cors = require('cors');

const app = express();
const server = createServer(app);

app.use(cors());

const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173", // Ensure this matches your frontend URL
    methods: ["GET", "POST"],
    credentials: true,
  },
});

io.on("connection", (socket) => {
  console.log("User connected");
  console.log("Id: " + socket.id);

  socket.emit("welcome-message", "Welcome to the server");

  socket.on("message", (data) => {
    console.log(`${socket.id} says: ${data}`);
    socket.broadcast.emit("message", `${socket.id} says: ${data}`);
  });

  socket.on("disconnect", () => {
    console.log(`User disconnected: ${socket.id}`);
  });
});

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

app.get('/', (req, res) => {
  res.send('Server is running!');
});
