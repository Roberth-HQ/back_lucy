import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('agents')
export class Agent {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  agent_id: string;

  @Column({ nullable: true })
  hostname: string;

  @Column({ nullable: true })
  mac: string;

  @Column({ nullable: true })
  subnet: string;

  @Column({ nullable: true })
  type: string; // 'GLPI' | 'GLPI_PLUS'

  @Column({ nullable: true })
  status: string; // 'online' | 'offline' | 'busy'

  @Column({ nullable: true })
  ram_gb: number;

  @Column({ nullable: true })
  cpu_cores: number;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  last_seen: Date;

  @Column({ default: false })
  is_default: boolean;
}
