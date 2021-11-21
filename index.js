const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const getRandomEmoji = require('get-random-emoji');
const io = new Server(server, {  cors: {
  origin: '*',
}});

app.use('/', express.static(__dirname + '/ui/build/'))

class AnarchyChat {
  constructor(io) {
    this.io = io
    this.messages = []
    this.people = {}
  }

  join(socket, person) {
    this.log(`${person.id} joined`)
    this.people[person.id] = person
    this.people[person.id].mode = "gc"
    socket.emit("set ident", this.people[person.id])
    socket.emit('chat hist', this.messages);

    socket.on('chat message', (msg) => {
      this.addMessage(socket, msg)
      this.io.emit('chat hist', this.messages);
    });
  }

  leave(socket, person) {
    this.log(`${person.id} left`)
    delete this.people[person.id]
  }

  log(message) {
    console.log("[Anarchy Chat]", message)
  }

  addMessage(socket, msg) {
    this.messages.push({
      user: this.people[socket.id],
      message: msg
    })
  }
}

class Lobby {
  constructor(io) {
    this.io = io
    this.people = {}
    this.anarchy = new AnarchyChat(io)
  }

  login(socket) {
    this.log("Logging in " + socket.id)

    // Create new Person
    this.people[socket.id] = createPerson(socket.id)

    // Notify socket of ident, notify group of new person
    socket.emit("set ident", this.people[socket.id])
    this.io.emit("members", Object.values(this.people))

    // Register mode switch callback
    socket.on('change mode', (newMode) => {
      // Only use lobby callback if currently in the lobby
      if (this.people[socket.id].mode == "lob") {
        this.switchModes(socket, newMode);
      }
    })
  }

  logout(socket) {
    this.log("Logging out " + socket.id)
    delete this.people[socket.id]
    io.emit("members", Object.values(this.people))
  }

  log(message) {
    console.log("[Lobby]", message)
  }

  switchModes(socket, newMode) {
    // Anarchy Chat
    if (newMode == "gc") {
      this.log(`Moving ${socket.id} to Anarchy Chat`)
      this.anarchy.join(socket, this.people[socket.id])
    }
  }
}


let lobby = new Lobby(io)

function createPerson(id) {
  return {
    id,
    emoji: getRandomEmoji(),
    mode: "lob",
    room: "na"
  }
}


io.on('connection', (socket) => {
  lobby.login(socket);
  // people[socket.id] = createPerson()

  // io.emit('chat hist', messages);
  // socket.emit("set ident", people[socket.id])
  // io.emit("members", Object.values(people))

  // socket.on('chat message', (msg) => {
  //   addMessage(msg, socket)
  //   io.emit('chat hist', messages);
  // });

  // socket.on('new ident', () => {
  //   people[socket.id].emoji = getRandomEmoji()
  //   socket.emit("set ident", people[socket.id])
  //   io.emit("members", Object.values(people))
  // })

  // socket.on('change mode', (newMode) => {
  //   people[socket.id].mode = newMode
  //   socket.emit("set ident", people[socket.id])
  //   io.emit("members", Object.values(people))
  // })

  socket.on('disconnect', () => {
    lobby.logout(socket)
    // delete people[socket.id]
    // io.emit("members", Object.values(people))
  })
});

server.listen(3000, () => {
  console.log('listening on *:3000');
});