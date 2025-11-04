import { Module } from '@nestjs/common';
import { DispositivosService } from './dispositivos.service';
import { DispositivosGateway } from './ws/dispositivos.gateway';
import { DispositivosController } from './dispositivos.controller';
import { AgentesWsService  } from '../agents/ws/agentes.ws.service'; // ⬅️ importamos el WS, DispositivosWsService
//import { DispositivosAgentGateway } from './dispositivos.agent.gateway';
import { AgentsModule } from '../agents/agents.module'
import { EscaneosModule } from 'src/escaneos/escaneos.module';

@Module({
  imports:[AgentsModule,EscaneosModule],
  controllers: [DispositivosController],
  providers: [DispositivosService, DispositivosGateway ],
})
export class DispositivosModule {}
