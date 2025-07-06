import { Test, TestingModule } from '@nestjs/testing';
import { StockLogService } from './stock-log.service';

describe('StockLogService', () => {
  let service: StockLogService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [StockLogService],
    }).compile();

    service = module.get<StockLogService>(StockLogService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
