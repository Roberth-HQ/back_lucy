// agents/agent.entity.ts
import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('agents')
export class AgentEntity {
  @Column({ primary: true })
  agentId: string; // UUID generado automáticamente

  @Column()
  subnet: string;

  @Column({ default: 'online' })
  status: 'online' | 'offline';

  @Column({ default: false })
  isFallback: boolean; // true si es el agente principal de respaldo

  @Column({ default: 1 })
  leaderNumber: number; // 1 = líder de su subred

  @Column({ default: 1 })
  cpuCores: number;

  @Column({ default: 1024 })
  ramMb: number;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  lastSeen: Date; // para saber si está activo
}
