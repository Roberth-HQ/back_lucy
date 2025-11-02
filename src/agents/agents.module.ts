  import { Module } from '@nestjs/common';
  import { AgentsService } from './agents.service';
  import { AgentsController } from './agents.controller';
  import { AgentEntity } from './entities/agent.entity';
  import { AgentesWsService } from './ws/agentes.ws.service';
  import { TypeOrmModule } from '@nestjs/typeorm';

  @Module({
    imports:[TypeOrmModule.forFeature([AgentEntity  ])],
    controllers: [AgentsController],
    providers: [AgentsService,AgentesWsService],
    exports:[AgentsService, AgentesWsService]
  })
  export class AgentsModule {}
