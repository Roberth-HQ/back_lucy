import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { DispositivosService } from './dispositivos.service';
import { CreateDispositivoDto } from './dto/create-dispositivo.dto';
import { UpdateDispositivoDto } from './dto/update-dispositivo.dto';

@Controller('dispositivos')
export class DispositivosController {
  constructor(private readonly dispositivosService: DispositivosService) {}

  @Post()
  async startScan(@Body() scanRequesDto: any) {
        //console.log('Body recibido en controlador:', createDispositivoDto);
        //console.log("soporte tecnico recibido")
        ///console.log(createDispositivoDto);
    return this.dispositivosService.startScan(scanRequesDto);
  }

  @Post('found')
  async foundDevice(@Body() foundDeviceDto: any){
    return this.dispositivosService.handleFoundDevice(foundDeviceDto);
  }

  @Get()
  findAll() {
    //return this.dispositivosService.findAll();
    console.log('hola desdee mi corazon')
    return "hola desdes dispositivos";
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.dispositivosService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateDispositivoDto: UpdateDispositivoDto) {
    return this.dispositivosService.update(+id, updateDispositivoDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.dispositivosService.remove(+id);
  }
}
