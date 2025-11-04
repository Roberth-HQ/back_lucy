import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EscaneosService } from './escaneos.service';
import { EscaneosController } from './escaneos.controller';
import { EscaneoResumenEntity } from './entities/escaneo-resumen.entity';
import { EscaneoDetalleEntity } from './entities/escaneo-detalle.entity';

@Module({
    imports: [
    TypeOrmModule.forFeature([EscaneoResumenEntity, EscaneoDetalleEntity]),
  ],
  providers: [EscaneosService],
  controllers: [EscaneosController],
  exports:[EscaneosService]
})
export class EscaneosModule {}
