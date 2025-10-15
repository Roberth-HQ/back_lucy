import { Module } from '@nestjs/common';
import { DispositivosService } from './dispositivos.service';
import { DispositivosGateway } from './dispositivos.gateway';
import { DispositivosController } from './dispositivos.controller';

@Module({
  controllers: [DispositivosController],
  providers: [DispositivosService, DispositivosGateway],
})
export class DispositivosModule {}
