import { Server, Socket } from "socket.io";
import { Room } from "./Room";

export class OOOManager {
    io: Server
    // lobby: Room
    rooms: Room[]
    queued: boolean;

    constructor(io: Server) {
        this.io = io;
        // this.lobby = new Room(io, "OOOLobby");
        this.rooms = [];
        this.queued = false
    }

    enter (socket: Socket) {
        if(!this.queued) {
            const room = new Room(this.io, `ooo:${this.rooms.length}`)
            this.rooms.push(room)
            socket.emit("ooo:roomnumber", room.id)

            room.enter(socket);
            room.updateState({
                user1: socket.id
            })

            this.queued = true;
        }

        else if (this.queued) {
            const room = this.rooms[this.rooms.length - 1]
            socket.emit("ooo:roomnumber", room.id)

            room.enter(socket)
            room.updateState({
                user2: socket.id
            })

            this.queued = false
        }

        socket.on("ooo:send_msg", (msg, roomId) => {
            console.log("sndmsg", socket.id, roomId);
            
            let room = this.rooms.find(room => room.id == roomId)
            if (room) {
                const isMember = room.state.user1 == socket.id || room.state.user2 == socket.id
                if (isMember) {
                    console.log("Sending message", msg, socket.id, room.id)
                    room.updateState({
                        events: [
                            ...(room.state.events || []), {
                                user: socket.id,
                                message: msg
                            }
                        ]
                    })
                }
            }
        })
    }

    leave (socket: Socket ) {

    }


}