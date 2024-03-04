import { Server, Socket } from "socket.io";

export const registerUserHandlers = (io: Server, socket: Socket) => {
  socket.on('user:id', (user_id) => {
    if(user_id) {
      socket.join(`user:${user_id}`)
    } else {
      socket.rooms.forEach(room => {
        if(room.substring(0,5) === 'user:') {
          socket.leave(room);
        }
      });
    }
  });
};