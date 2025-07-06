import { Test, TestingModule } from '@nestjs/testing';
import { StockLogController } from './stock-log.controller';

describe('StockLogController', () => {
  let controller: StockLogController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [StockLogController],
    }).compile();

    controller = module.get<StockLogController>(StockLogController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
