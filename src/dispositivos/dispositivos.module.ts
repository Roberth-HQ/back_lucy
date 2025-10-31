import { Module } from '@nestjs/common';
import { DispositivosService } from './dispositivos.service';
import { DispositivosGateway } from './ws/dispositivos.gateway';
import { DispositivosController } from './dispositivos.controller';
import { AgentesWsService  } from './ws/agentes.ws.service'; // ⬅️ importamos el WS, DispositivosWsService
//import { DispositivosAgentGateway } from './dispositivos.agent.gateway';

@Module({
  controllers: [DispositivosController],
  providers: [DispositivosService, DispositivosGateway, AgentesWsService ],
})
export class DispositivosModule {}
