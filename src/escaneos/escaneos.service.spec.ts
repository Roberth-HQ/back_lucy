import { Test, TestingModule } from '@nestjs/testing';
import { EscaneosService } from './escaneos.service';

describe('EscaneosService', () => {
  let service: EscaneosService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [EscaneosService],
    }).compile();

    service = module.get<EscaneosService>(EscaneosService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
