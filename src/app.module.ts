import { Module } from '@nestjs/common';
import { DispositivosModule } from './dispositivos/dispositivos.module';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AgentsModule } from './agents/agents.module';
import { EscaneosModule } from './escaneos/escaneos.module';


@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal:true,
    }),
    TypeOrmModule.forRoot({
      type:'postgres',
      url:process.env.DATABASE_URL,
      autoLoadEntities:true,
      synchronize:true
    }),
    DispositivosModule,
    AgentsModule,
    EscaneosModule],

  
})
export class AppModule {}
