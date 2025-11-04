export class CreateEscaneoDetalleDto {
  escaneoResumenId: string; // FK al resumen
  ip: string;
  mac: string;
  alive: string;
  via: string;
  device: string;
  name: string;
}