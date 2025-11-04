// src/escaneos/entities/escaneo-resumen.entity.ts
import { Entity, PrimaryGeneratedColumn, Column, OneToMany, CreateDateColumn } from 'typeorm';
import { EscaneoDetalleEntity } from './escaneo-detalle.entity';

@Entity('escaneo_resumen')
export class EscaneoResumenEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  subred: string;

  @Column({ type: 'int' })
  totalDispositivos: number;

  @CreateDateColumn()
  fecha: Date;

  @OneToMany(() => EscaneoDetalleEntity, detalle => detalle.escaneoResumen, { cascade: true })
  detalles: EscaneoDetalleEntity[];
}
