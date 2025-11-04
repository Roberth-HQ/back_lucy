// src/escaneos/entities/escaneo-detalle.entity.ts
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { EscaneoResumenEntity } from './escaneo-resumen.entity';

@Entity('escaneo_detalle')
export class EscaneoDetalleEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  ip: string;

  @Column()
  mac: string;

  @Column()
  alive: string;

  @Column()
  via: string;

  @Column()
  device: string;

  @Column()
  name: string;

  @ManyToOne(() => EscaneoResumenEntity, resumen => resumen.detalles)
  @JoinColumn({ name: 'escaneoResumenId' })
  escaneoResumen: EscaneoResumenEntity;

  @Column()
  escaneoResumenId: string;
}
