import { EscaneosService } from './../../escaneos/escaneos.service';
import {
  WebSocketGateway,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
} from '@nestjs/websockets';
import { Server } from 'socket.io';
import { CreateEscaneoDetalleDto } from '../../escaneos/dto/create-escaneo-detalle.dto';
import { CreateEscaneoResumenDto } from '../../escaneos/dto/create-escaneo-resumen.dto';

@WebSocketGateway({
  cors: {
    origin: '*', // ⚠️ Cambia esto en producción
  },
})
export class DispositivosGateway implements OnGatewayConnection, OnGatewayDisconnect {
  //buffer de datos de dispostivos 
  private bufferDispositivos: { [subred: string]: any[] } = {};
  constructor (private readonly  escaneosService: EscaneosService){}
  @WebSocketServer()
  server: Server;

  handleConnection(client: any) {
    console.log(`Cliente conectado: ${client.id}`);
  }

  handleDisconnect(client: any) {
    console.log(`Cliente desconectado: ${client.id}`);
  }

  // 👉 Método para emitir datos a todos los clientes
 // emitirDispositivo(data: any) {
   // this.server.emit('nuevo_dispositivo', data);
  //}

    // emitirDispositivo(data: any) {
    // console.log('📡 Enviando por socket:', data);
    // this.server.emit('nuevo-dispositivo', data);
    //   if (!this.bufferDispositivos[data.subred]) {
    // this.bufferDispositivos[data.subred] = [];
    // }
    // this.bufferDispositivos[data.subred].push(data);
    // }

emitirDispositivo(data: any) {
  console.log('📡 Enviando por socket:', data);
  // 1️⃣ Emitir inmediatamente al Front
  this.server.emit('nuevo-dispositivo', data);

  // 2️⃣ Guardar en buffer para la BD
  const subred = data.subred || 'default';
// cuando guardas el dispositivo en el buffer (emitirDispositivo)
if (!this.bufferDispositivos[subred]) this.bufferDispositivos[subred] = [];
this.bufferDispositivos[subred].push({ ...data });

// LOG inmediato (verás en consola cómo queda)
//console.log('📥 buffer actual (después push):', JSON.stringify(this.bufferDispositivos, null, 2));
}

// Método que se llama cuando llega el mensaje final de la subred
async emitirEventoFinal(data: any) {
  console.log('✅ Enviando mensaje final:', data);

  // Siempre usar 'default' para obtener los dispositivos reales
  const subred = 'default';
  const detalles = this.bufferDispositivos[subred] || [];

  console.log('🔎 Usando subred para guardar:', subred, '-> detalles en buffer:', detalles.length);

  const resumen = {
    subred: data.subred || '0', // aquí guardas la subred real en el resumen si quieres
    totalDispositivos: detalles.length,
    fecha: new Date(),
  };

  const resumenGuardado = await this.escaneosService.guardarResumen(resumen);

  const detallesDto: CreateEscaneoDetalleDto[] = detalles.map(d => ({
    escaneoResumenId: resumenGuardado.id,
    ip: d.ip || "0.0.0.0",
    mac: d.mac || "",
    alive: d.alive || "sí",
    via: d.via || "",
    device: d.device || "",
    name: d.name || "",
  }));

  await this.escaneosService.guardarDetalles(resumenGuardado.id, detallesDto);

  // Limpiar buffer
  delete this.bufferDispositivos[subred];

  this.server.emit('escaneo-finalizado', data);
}



}
