import { Module } from '@nestjs/common';
import { StockLogService } from './stock-log.service';
import { StockLogController } from './stock-log.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StockLog } from './entity/stock-log.entity';
import { Products } from '../product/entity/product.entity';

@Module({
  imports: [TypeOrmModule.forFeature([StockLog, Products])],
  controllers: [StockLogController],
  providers: [StockLogService],
  exports: [StockLogService],
})
export class StockLogModule {}
