    // dispositivos.ws.ts
    import { WebSocketServer } from 'ws';
    import { Injectable, OnModuleInit } from '@nestjs/common';
    
    interface Agent {
    agentId: string;
    socket: WebSocket;
    subnet: string;
    type: string;
    status: 'online' | 'offline' | 'busy';
    }

    @Injectable()
    export class AgentesWsService  implements OnModuleInit {
    private wss: WebSocketServer;
    private agents: Map<string, Agent> = new Map();

    onModuleInit() {
        this.wss = new WebSocketServer({ port: 8082 }); // puedes cambiar el puerto si deseas
        console.log('🌐 Servidor WebSocket escuchando en ws://localhost:8082');

        this.wss.on('connection', (ws, req) => {
        console.log('✅ Agente conectado desde:', req.socket.remoteAddress);

        ws.send(JSON.stringify({ msg: 'Conexión establecida con backend NestJS ✅' }));

        ws.on('message', (message) => {
            console.log('📩 Mensaje recibido del agente:', message.toString());
        });

        ws.on('close', () => {
            console.log('❌ Agente desconectado');
        });
        });
    }

    // Método para enviar mensajes a todos los agentes conectados
    broadcast(data: any) {
        const json = JSON.stringify(data);
        this.wss.clients.forEach((client) => {
        if (client.readyState === 1) {
            client.send(json);
        }
        });
    }


    // dispositivos.ws.ts (añadir dentro de DispositivosWsService)
    sendScanRequestToAgents(subred: string) {
    const message = {
        type: 'scan_request',   // tipo de mensaje que el agente entenderá
        data: {
        subred: subred
        }
    };

    const json = JSON.stringify(message);

    this.wss.clients.forEach((client) => {
        if (client.readyState === 1) { // solo clientes conectados
        client.send(json);
        }
    });

    console.log(`📤 Comando scan_request enviado a todos los agentes: ${subred}`);
    }
    }
