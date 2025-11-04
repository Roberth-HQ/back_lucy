import { Controller, Post, Body } from '@nestjs/common';
import { EscaneosService } from './escaneos.service';
import { CreateEscaneoResumenDto } from './dto/create-escaneo-resumen.dto';
import { CreateEscaneoDetalleDto } from './dto/create-escaneo-detalle.dto';

class GuardarEscaneoDto {
  resumen: CreateEscaneoResumenDto;
  detalles: CreateEscaneoDetalleDto[];
}

@Controller('escaneos')
export class EscaneosController {
  constructor(private readonly escaneosService: EscaneosService) {}

  // Guardar escaneo manual (desde la app)
  @Post('guardar')
  async guardarEscaneo(@Body() dto: GuardarEscaneoDto) {
    const resumenGuardado = await this.escaneosService.guardarResumen(dto.resumen);
    await this.escaneosService.guardarDetalles(resumenGuardado.id, dto.detalles);
    return { mensaje: 'Escaneo guardado correctamente', resumenId: resumenGuardado.id };
  }

  // Guardar automáticamente según lógica de 7 días
  @Post('guardar-automatico')
  async guardarEscaneoAutomatico(@Body() dto: GuardarEscaneoDto) {
    return await this.escaneosService.guardarAutomatico(
      dto.resumen.subred,
      dto.resumen,
      dto.detalles,
    );
  }
}
