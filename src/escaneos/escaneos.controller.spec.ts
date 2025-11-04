import { Test, TestingModule } from '@nestjs/testing';
import { EscaneosController } from './escaneos.controller';

describe('EscaneosController', () => {
  let controller: EscaneosController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [EscaneosController],
    }).compile();

    controller = module.get<EscaneosController>(EscaneosController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
