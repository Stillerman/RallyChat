import express from 'express';
const app = express();
import http from 'http';
const server = http.createServer(app);
import { Server } from "socket.io";
import { Adapter } from './Adapter';
const io = new Server(server, {  cors: {
  origin: '*',
}});

app.use('/', express.static(__dirname + '/../UI/build/'))

new Adapter(io)

server.listen(3000, () => {
  console.log('listening on *:3000');
});