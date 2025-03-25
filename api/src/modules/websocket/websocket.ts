import { SubscribeMessage, WebSocketGateway, WebSocketServer, OnGatewayConnection, OnGatewayDisconnect } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { AuthFunctions } from '../../middlewares/auth.middleware';

@WebSocketGateway({
  cors: {
    origin: true,
    credentials: true,
    allowedHeaders: ['Content-Type', 'Authorization', 'x-csrf-token'],
    exposedHeaders: ['*', 'Authorization', "X-Set-Cookie"]
  }
})
export class NotificationsGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer() server: Server;
  connectedClients = new Map<number, Socket>();

  constructor(private authService: AuthFunctions) { }


  async handleConnection(client: Socket, Request) {
    try {
      const token = await this.receberCookie(client.handshake.headers.cookie);
      if (!token) {
        client.disconnect();
        return;
      }
      const myData = await this.authService.getMyData(
        {
          "cookies": {
            "meuToken": token
          }
        });
      if (!myData) {
        client.disconnect();
        return;
      }
      
      this.connectedClients.set(myData.idConta, client);
    } catch (error) {
      console.log(error)
      client.disconnect();
    }
  }

  async receberCookie(cookie) {
    if (!cookie) return null;

    const startIndex = cookie.indexOf('meuToken=');
    if (startIndex === -1) return null;

    const idValue = cookie.substring(startIndex + 9);

    const endIndex = idValue.indexOf(';');


    const id = endIndex === -1 ? idValue : idValue.substring(0, endIndex);

    return id;
  }

  async handleDisconnect(client: Socket) {
    try {
      const token = await this.receberCookie(client.handshake.headers.cookie);
      if (!token) {
        client.disconnect();
        return;
      }
      const myData = await this.authService.getMyData(
        {
          "cookies": {
            "meuToken": token
          }
        });
      const accountId = myData.idConta
      if (accountId) {
        this.connectedClients.delete(accountId);
      }
    } catch (error) {
      console.log(error)
      client.disconnect();
    }
  }


  sendNotification(accountId: number, data: any) {
    this.connectedClients.forEach((socket, id) => {
      if (id == accountId) {
        socket.emit('paymentStatusUpdate', { accountId, data });
      }
    });
  }
}
