import {
  WebSocketGateway,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server } from 'socket.io';

@WebSocketGateway({
  cors: {
    origin: '*', // ⚠️ Cambia esto en producción
  },
})
export class DispositivosGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  handleConnection(client: any) {
    console.log(`Cliente conectado: ${client.id}`);
  }

  handleDisconnect(client: any) {
    console.log(`Cliente desconectado: ${client.id}`);
  }

  // 👉 Método para emitir datos a todos los clientes
  emitirDispositivo(data: any) {
    this.server.emit('nuevo_dispositivo', data);
  }
}
