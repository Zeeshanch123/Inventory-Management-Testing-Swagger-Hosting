import { Test, TestingModule } from '@nestjs/testing';
import { StockLogController } from './stock-log.controller';
import { StockLogService } from './stock-log.service';

describe('StockLogController', () => {
  let controller: StockLogController;
  let service: StockLogService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [StockLogController],
      providers: [
        {
          provide: StockLogService,
          useValue: {
            create: jest.fn(),
            findAll: jest.fn(),
            findByProduct: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<StockLogController>(StockLogController);
    service = module.get<StockLogService>(StockLogService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should have StockLogService injected', () => {
    expect(service).toBeDefined();
  });
});
