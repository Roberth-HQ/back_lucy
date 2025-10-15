import { Module } from '@nestjs/common';
import { DispositivosModule } from './dispositivos/dispositivos.module';

@Module({
  imports: [DispositivosModule],

  
})
export class AppModule {}
