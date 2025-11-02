// import { Injectable } from '@nestjs/common';
// import { CreateAgentDto } from './dto/create-agent.dto';
// import { UpdateAgentDto } from './dto/update-agent.dto';
// import { AgentEntity } from './entities/agent.entity'
// import { InjectRepository } from '@nestjs/typeorm';
// import { Repository } from 'typeorm';

// agents/agents.service.ts
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AgentEntity } from './entities/agent.entity';

@Injectable()
export class AgentsService {
  constructor(
    @InjectRepository(AgentEntity)
    private readonly agentRepo: Repository<AgentEntity>,
  ) {}

async registerAgent(data: any): Promise<AgentEntity> {
  const { agentId, subnet, cpuCores, ramMb, isFallback } = data;

  // Buscar por agentId (que ahora es la MAC)
  let agent = await this.agentRepo.findOne({ where: { agentId } });

  if (agent) {
    agent.subnet = subnet;
    agent.cpuCores = cpuCores;
    agent.ramMb = ramMb;
    agent.isFallback = isFallback;
    agent.status = 'online';
    agent.lastSeen = new Date();

    return await this.agentRepo.save(agent);
  }

  // Si no existe, lo crea
  agent = this.agentRepo.create({
    agentId, // Aquí guardamos la MAC
    subnet,
    cpuCores,
    ramMb,
    isFallback,
    status: 'online',
    lastSeen: new Date(),
  });

  return await this.agentRepo.save(agent);
}


  async updateStatus(agentId: string, status: 'online' | 'offline') {
    await this.agentRepo.update(agentId, { status, lastSeen: new Date() });
  }

  async getLeaderBySubnet(subnet: string) {
    return this.agentRepo.findOne({
      where: { subnet, leaderNumber: 1, status: 'online' },
    });
  }











  findAll() {
    return `This action returns all agents`;
  }

  findOne(id: number) {
    return `This action returns a #${id} agent`;
  }



  remove(id: number) {
    return `This action removes a #${id} agent`;
  }
}
