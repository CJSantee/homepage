import { Server, Socket } from "socket.io";

export const registerPoolHandlers = (io: Server, socket: Socket) => {
  socket.on('game:id', (pool_game_id) => {
    if(pool_game_id) {
      socket.join(`game:${pool_game_id}`)
    } else {
      socket.rooms.forEach(room => {
        if(room.substring(0,5) === 'game:') {
          socket.leave(room);
        }
      });
    }
  });

  socket.on('game:update', (pool_game_id) => {
    socket.broadcast.to(`game:${pool_game_id}`).emit('game:update');
  });
};