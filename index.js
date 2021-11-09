const express = require('express');
const app = express();
const http = require('http');
const faker = require("faker")
const server = http.createServer(app);
const { Server } = require("socket.io");
const getRandomEmoji = require('get-random-emoji');
const io = new Server(server);

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

let people = {}
let messages = []

function addMessage(msg, socket) {
  messages.push({
    user: people[socket.id],
    message: msg
  })
}

io.on('connection', (socket) => {
  // people[socket.id] = faker.name.firstName() + " " + faker.name.lastName()
  people[socket.id] = getRandomEmoji()
  io.emit('chat hist', messages);
  socket.emit("set ident", people[socket.id])


  socket.on('chat message', (msg) => {
    addMessage(msg, socket)
    io.emit('chat hist', messages);
  });

  socket.on('new ident', () => {
    people[socket.id] = getRandomEmoji()
    socket.emit("set ident", people[socket.id])
  })
});

server.listen(3000, () => {
  console.log('listening on *:3000');
});
