import { Server, Socket } from "socket.io";

export class Room {
  id: string; // Rooms id
  state: any; // Rooms state
  io: Server;

  constructor(io: Server, id: string) {
    this.io = io;
    this.id = id;
    this.state = {roomId: id};
  }

  updateState(dState: any) {
    // Change this.state
    this.state = { ...this.state, ...dState };
    // Notify room
    this.emit("updateState", this.state);
  }

  emit(event: string, payload: any) {
    this.io.to(this.id).emit(`${this.id}:${event}`, payload);
  }

  enter(socket: Socket) {
    socket.join(this.id);
    this.log(`${socket.id} has entered`);
  }

  leave(socket: Socket) {
    socket.leave(this.id);
    this.log(`${socket.id} has left`);
  }

  log(message) {
    const output = `[${this.id}] ${message}`;
    console.log(output);
    this.io.emit("debug", output);
  }
}
