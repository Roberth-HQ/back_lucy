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
  //console.log('📍 Estado actual del Map:', Array.from(this.agents.entries()));

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

      ws.on('close', async() => {
        console.log('❌ Agente desconectado');
        // Actualizar el estado en el Map y en la BD
        for (const [id, agent] of this.agents.entries()) {
          if (agent.socket === ws) {
            agent.status = 'offline';
            await this.agentsService.updateStatus(id, 'offline');
            this.agents.delete(id);
            break;
          }
        }
       // console.log('📍 Estado actual del Map:', Array.from(this.agents.entries()));
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


  sendToAgent(subnet: string, message: any, agentId?: string) {
  // Si hay agentId explícito, buscar ese primero
  let targetAgent: Agent | undefined;

  if (agentId) {
    targetAgent = this.agents.get(agentId);
    if (!targetAgent) {
      console.warn(`⚠️ No se encontró el agente con ID ${agentId} en el Map.`);
    }
  }

  // Si no hay agentId o no se encontró, buscar por subred
  if (!targetAgent) {
    const agentsInSubnet = Array.from(this.agents.values()).filter(
      (a) => a.subnet === subnet
    );

    if (agentsInSubnet.length > 0) {
      // Ordenar por leaderNumber (menor = mayor prioridad)
      agentsInSubnet.sort((a, b) => a.leaderNumber - b.leaderNumber);
      targetAgent = agentsInSubnet[0]; // El líder actual
    }
  }

  // Si aún no hay agente, usar fallback
  if (!targetAgent) {
    const fallback = Array.from(this.agents.values()).find(
      (a) => a.isFallback
    );

    if (fallback) {
      console.log(`⚙️ Usando agente fallback: ${fallback.agentId}`);
      targetAgent = fallback;
    }
  }

  // Si finalmente tenemos un agente, enviamos el mensaje
  if (targetAgent && targetAgent.socket?.readyState === 1) {
    try {
      const json = JSON.stringify(message);
      targetAgent.socket.send(json);
      console.log(
        `📤 Mensaje enviado a agente ${targetAgent.agentId} (subred ${targetAgent.subnet})`
      );
    } catch (err) {
      console.error(`❌ Error al enviar mensaje al agente ${targetAgent.agentId}:`, err);
    }
  } else {
    console.warn(
      `⚠️ No hay agentes disponibles para la subred ${subnet} ni fallback online.`
    );
  }
}
}
