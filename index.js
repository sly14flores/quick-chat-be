const express = require("express");
const mongoose = require("mongoose");
const Router = require("./routes")
const cors = require('cors');
const app = express();

const { createServer } = require("http");
const { Server } = require("socket.io");
const httpServer = createServer();
const io = new Server(httpServer, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

io.on("connection", (socket) => {
  console.log(`${socket.id} is connected`)
  socket.on('message', (payload) => {
    // console.log(payload)
    socket.broadcast.emit('getConvo', payload)
  })
  socket.on('login', (payload) => {
    console.log(`${payload.name} has login`)
    socket.broadcast.emit('userLogin', payload)
  })
  socket.on('logout', (payload) => {
    socket.broadcast.emit('userLogin', payload)
  })
  socket.on('chat', (payload) => {
    socket.broadcast.emit('chatFocus', payload)
  })
});

httpServer.listen(5000);

app.use(cors({
  origin: '*'
}));

app.use(express.json());

const username = "sly";
const password = "A7iYw64zh-pqngf";
const cluster = "cluster0";
const dbname = "quickChat";
mongoose.connect(
  `mongodb+srv://${username}:${password}@${cluster}.6l7hb.mongodb.net/${dbname}?retryWrites=true&w=majority`
);

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error: "));
db.once("open", function () {
  console.log("Connected successfully");
});

app.use('/api', Router);

app.listen(4000, () => {
  console.log("Server is running at port 4000");
});