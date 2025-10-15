import { Injectable } from '@nestjs/common';
import { CreateDispositivoDto } from './dto/create-dispositivo.dto';
import { UpdateDispositivoDto } from './dto/update-dispositivo.dto';
import { json } from 'stream/consumers';
import { DispositivosGateway } from './dispositivos.gateway';

@Injectable()
export class DispositivosService {
  constructor(private readonly gateway: DispositivosGateway){}

  async create(createDispositivoDto: any) {
    //console.log('Dispositivo resivido: ', createDispositivoDto);
    const response = await fetch('http://localhost:8081/scan',{
      method:'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(createDispositivoDto)
    });
    const text = await response.text();

    try{
      const data=JSON.parse(text);
      this.gateway.emitirDispositivo(data);
      return data;
    }catch (err){
      this.gateway.emitirDispositivo(text);
      return text;
    }

  }

  findAll() {
    return `This action returns all dispositivos`;
  }

  findOne(id: number) {
    return `This action returns a #${id} dispositivo`;
  }

  update(id: number, updateDispositivoDto: UpdateDispositivoDto) {
    return `This action updates a #${id} dispositivo`;
  }

  remove(id: number) {
    return `This action removes a #${id} dispositivo`;
  }
}
