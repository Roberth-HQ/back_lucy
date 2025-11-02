import { WebSocketServer } from 'ws';
import { Injectable, OnModuleInit } from '@nestjs/common';
import { AgentsService } from './../agents.service';

// Interfaz para los agentes que están conectados por WS
interface Agent {
  agentId: string;
  socket: WebSocket;
  subnet: string;
  status: 'online' | 'offline';
  leaderNumber: number;
  cpuCores: number;
  ramMb: number;
  isFallback: boolean;
}

@Injectable()
export class AgentesWsService implements OnModuleInit {
  private wss: WebSocketServer;
  private agents: Map<string, Agent> = new Map();

  constructor(private readonly agentsService: AgentsService) {}

  onModuleInit() {
    this.wss = new WebSocketServer({ port: 8082 });
    console.log('🌐 Servidor WebSocket escuchando en ws://localhost:8082');

    this.wss.on('connection', (ws, req) => {
      console.log('✅ Agente conectado desde:', req.socket.remoteAddress);

      ws.send(JSON.stringify({ msg: 'Conexión establecida con backend NestJS ✅' }));

      // Listener único para todos los mensajes del agente
      ws.on('message', async (message) => {
        console.log('📩 Mensaje recibido del agente:', message.toString());
        try {
          const data = JSON.parse(message.toString());

if (data.type === 'register') {
  const agentPayload = data.data;  // Aquí está todo: agentId, subnet, cpuCores, ramMb, isFallback
  const savedAgent = await this.agentsService.registerAgent({
    agentId: agentPayload.agentId,
    subnet: agentPayload.subnet,
    cpuCores: agentPayload.cpuCores,
    ramMb: agentPayload.ramMb,
    isFallback: agentPayload.isFallback || false,
  });

  // Guardar en Map para WS
  this.agents.set(savedAgent.agentId, { ...savedAgent, socket: ws });

  ws.send(JSON.stringify({
    type: 'ack',
    agentId: savedAgent.agentId,
    leaderNumber: savedAgent.leaderNumber
  }));
}

          // Aquí podrías agregar otros tipos de mensajes (scan_result, etc.)
        } catch (err) {
          console.error('Error procesando mensaje:', err);
        }
      });

      ws.on('close', () => {
        console.log('❌ Agente desconectado');
        // Actualizar el estado en el Map y en la BD
        for (const [id, agent] of this.agents.entries()) {
          if (agent.socket === ws) {
            agent.status = 'offline';
            this.agentsService.updateStatus(id, 'offline');
            this.agents.delete(id);
            break;
          }
        }
      });
    });
  }

  // Enviar mensaje a todos los agentes conectados
  broadcast(data: any) {
    const json = JSON.stringify(data);
    this.wss.clients.forEach((client) => {
      if (client.readyState === 1) {
        client.send(json);
      }
    });
  }

  // Enviar un scan_request a todos los agentes
  sendScanRequestToAgents(subnet: string) {
    const message = {
      type: 'scan_request',
      data: { subnet },
    };

    const json = JSON.stringify(message);

    this.wss.clients.forEach((client) => {
      if (client.readyState === 1) {
        client.send(json);
      }
    });

    console.log(`📤 Comando scan_request enviado a todos los agentes: ${subnet}`);
  }
}
