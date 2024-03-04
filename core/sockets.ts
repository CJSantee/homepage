import { Server } from 'socket.io';

export let io: Server;

export function initSocket(server) {
  io = new Server(server, {
    cors: {
      origin: "http://localhost:3000"
    }
  });
}