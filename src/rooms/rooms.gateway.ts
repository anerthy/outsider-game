@WebSocketGateway({ namespace: '/rooms' })
export class RoomsGateway {
  @WebSocketServer()
  server: Server;

  @SubscribeMessage('joinRoom')
  handleJoinRoom(
    client: Socket,
    payload: { roomId: string; playerName: string },
  ) {
    client.join(payload.roomId);
    this.server.to(payload.roomId).emit('playerJoined', payload);
  }

  @SubscribeMessage('startGame')
  handleStartGame(client: Socket, roomId: string) {
    this.server.to(roomId).emit('gameStarted', {
      /* game data */
    });
  }
}
