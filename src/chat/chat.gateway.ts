import { Logger } from '@nestjs/common/services';
import { WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import {
  ConnectedSocket,
  MessageBody,
  SubscribeMessage,
} from '@nestjs/websockets/decorators';
import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
} from '@nestjs/websockets/interfaces';
import { Server, Socket } from 'socket.io';
@WebSocketGateway({
  cors: {
    oringin: '*',
  },
})
export class ChatsGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  server: Server;
  private logger = new Logger('AppGateway');

  afterInit() {
    this.logger.log('Gateway init');
  }
  handleConnection(client: any) {
    this.logger.log(`User ${client.id} connected`);
  }
  handleDisconnect(client: any) {
    this.logger.log(`User ${client.id} disconnect`);
  }

  @SubscribeMessage('game')
  testandoGame(
    @MessageBody() data: string,
    @ConnectedSocket() client: Socket,
  ): void {
    client.data.gate = {
      data,
      id: client.id,
    };
    this.server.emit('testeBack', {
      data,
      id: client.id,
    });
  }
}
