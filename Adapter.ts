import { Server } from "socket.io";
import { Room } from "./Room";
import { createUser, User } from "./User";

/*
User in lobby
- See number of members
- Enter anarchy or one on one
User in anarchy chat
- Send message
- Get message history
- Leave to lobby
User in one on one
- Get added to an emmpty room, or a room with one other person
- messages in that room
- Leave to lobby

LOBBY
- room = lobby
- client <- user_counts
- client -> change_mode
ANARCHY
- room = anarchy
- client <- chat_hist
- client -> send_msg
- client -> leave_chat
ONE ON ONE
- room = oneonone:<room_number>
- client <- room_details (either there is another person in there or not)
- client <- chat_hist
- client -> send_msg
- client -> leave_chat
*/

export class Adapter {
  io: Server;
  lobby: Room;
  anarchyChat: Room;
  oooRooms: Room[];
  users: { [id: string]: User };

  constructor(io: Server) {
    this.io = io;
    this.lobby = new Room(io, "lobby");
    this.anarchyChat = new Room(io, "anarchy");
    this.oooRooms = [];
    this.users = {};

    this.io.on("connection", (socket) => {
      this.lobby.enter(socket);
      this.lobby.updateState({
        userCount: (this.lobby.state.userCount || 0) + 1,
      });

      this.users[socket.id] = createUser(socket.id)
      socket.emit("set ident", this.users[socket.id])

      socket.on("modeChange", (newMode) => {
        // Lobby to Anarchy
        if (this.users[socket.id].mode == "lobby" && newMode == "anarchy") {
          this.lobby.leave(socket);
          this.lobby.updateState({
            userCount: (this.lobby.state.userCount || 0) - 1,
          });

          this.users[socket.id].mode = "anarchy"
          socket.emit("set ident", this.users[socket.id])

          this.anarchyChat.enter(socket);

          this.anarchyChat.updateState({
            userCount: (this.anarchyChat.state.userCount || 0) + 1,
            events: [
              ...(this.anarchyChat.state.events || []),
              {
                type: "user entered",
                name: this.users[socket.id].emoji,
              },
            ],
          });
        }

        // Anarchy to Lobby
        if (this.users[socket.id].mode == "anarchy" && newMode == "lobby") {
          this.anarchyChat.leave(socket);
          this.anarchyChat.updateState({
            userCount: (this.anarchyChat.state.userCount || 0) - 1,
            events: [
              ...(this.anarchyChat.state.events || []),
              {
                type: "user left",
                name: this.users[socket.id].emoji,
              },
            ],
          });

          this.lobby.enter(socket);
          this.lobby.updateState({
            userCount: (this.anarchyChat.state.userCount || 0) + 1,
          });

          this.users[socket.id].mode = "lobby"
          socket.emit("set ident", this.users[socket.id])
        }
      });

      socket.on("anarchy:send_msg", msg => {
        if(this.users[socket.id].mode == "anarchy") {
          this.anarchyChat.updateState({
            events: [
              ...this.anarchyChat.state.events,
              {
                type: "message",
                user: this.users[socket.id].emoji,
                message: msg
              },
            ],
          })
        }
      })

      socket.on("disconnect", () => {
        if(this.users[socket.id].mode == "lobby") {
          this.lobby.leave(socket)
          this.lobby.updateState({
            userCount: (this.lobby.state.userCount || 0) - 1,
          });
        }

        if(this.users[socket.id].mode == "anarchy") {
          this.anarchyChat.leave(socket)
          this.anarchyChat.updateState({
            userCount: (this.anarchyChat.state.userCount || 0) - 1,
            events: [
              ...(this.anarchyChat.state.events || []),
              {
                type: "user left",
                name: this.users[socket.id].emoji,
              },
            ],
          });
        }
      })
    });
  }
}