export class Lobby {
    constructor(io) {
      this.io = io
      this.people = {}
    }
  
    login(socket) {
      console.log(`Adding ${socket.id} to lobby`);
      this.people[socket.id] = createPerson()
      this.socket.emit("set ident", people[socket.id])
      this.io.emit("members", Object.values(people))
    }
  
    logout(socket) {
      console.log(`Adding ${socket.id} to lobby`);
      delete this.people[socket.id]
      io.emit("members", Object.values(this.people))
    }
  }