// src/escaneos/escaneos.service.ts
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { EscaneoResumenEntity } from './entities/escaneo-resumen.entity';
import { EscaneoDetalleEntity } from './entities/escaneo-detalle.entity';
import { CreateEscaneoResumenDto } from './dto/create-escaneo-resumen.dto';
import { CreateEscaneoDetalleDto } from './dto/create-escaneo-detalle.dto';

@Injectable()
export class EscaneosService {
  constructor(
    @InjectRepository(EscaneoResumenEntity)
    private readonly resumenRepo: Repository<EscaneoResumenEntity>,

    @InjectRepository(EscaneoDetalleEntity)
    private readonly detalleRepo: Repository<EscaneoDetalleEntity>,
  ) {}

  async guardarResumen(dto: CreateEscaneoResumenDto) {
    const resumen = this.resumenRepo.create(dto);
    return await this.resumenRepo.save(resumen);
  }

  // async guardarDetalles(resumenId: string, detalles: CreateEscaneoDetalleDto[]) {
  //   const detallesEntity = detalles.map(d => {
  //     const entity = this.detalleRepo.create(d);
  //     entity.escaneoResumenId = resumenId;
  //     return entity;
  //   });
  //   return await this.detalleRepo.save(detallesEntity);
  // }
  async guardarDetalles(resumenId: string, detalles: CreateEscaneoDetalleDto[]) {
  const detallesEntity = detalles.map(d => {
    const entity = this.detalleRepo.create({
      ...d,
      // Sanear solo campos que puedan traer bytes sucios
      name: this.sanitizeString(d.name),
      device: this.sanitizeString(d.device),
    });
    entity.escaneoResumenId = resumenId;
    return entity;
  });

  return await this.detalleRepo.save(detallesEntity);
}

// Función para sanear strings no UTF-8 o caracteres problemáticos
sanitizeString(str: string | undefined): string {
  if (!str) return '';
  // Reemplaza bytes nulos y caracteres no imprimibles
  return str.replace(/[\x00-\x1F\x7F-\x9F]/g, '?').trim();
}


  async obtenerUltimoResumenPorSubred(subred: string) {
    return await this.resumenRepo.findOne({
      where: { subred },
      order: { fecha: 'DESC' },
    });
  }

async guardarAutomatico(
  subred: string,
  resumenDto: CreateEscaneoResumenDto,
  detallesDto: CreateEscaneoDetalleDto[],
) {
  console.log('🔍 Guardar automático ejecutado');
  const ultimo = await this.obtenerUltimoResumenPorSubred(subred);
  console.log('🕓 Último escaneo encontrado:', ultimo ? ultimo.fecha : 'Ninguno');

  const ahora = new Date();

  if (!ultimo || (ahora.getTime() - new Date(ultimo.fecha).getTime()) >= 7 * 24 * 60 * 60 * 1000) {
    console.log('💾 Guardando nuevo resumen...');
    const resumenGuardado = await this.guardarResumen(resumenDto);
    console.log('✅ Resumen guardado con ID:', resumenGuardado.id);

    await this.guardarDetalles(resumenGuardado.id, detallesDto);
    console.log('✅ Detalles guardados:', detallesDto.length);

    return { mensaje: 'Escaneo guardado automáticamente', resumenId: resumenGuardado.id };
  }

  console.log('⏳ No se guardó. Menos de 7 días desde el último escaneo');
  return { mensaje: 'No se guardó. Menos de 7 días desde el último escaneo', resumenId: ultimo?.id };
}

}
