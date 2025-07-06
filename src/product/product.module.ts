import { Module } from '@nestjs/common';
import { ProductService } from './product.service';
import { ProductController } from './product.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Products } from './entity/product.entity';
import { Supplier } from '../supplier/entity/supplier.entity';
import { StockLog } from '../stock-log/entity/stock-log.entity';
import { StockLogService } from '../stock-log/stock-log.service';

@Module({
    imports: [TypeOrmModule.forFeature([Products, Supplier, StockLog])],
    controllers: [ProductController],
    providers: [ProductService, StockLogService],
})
export class ProductModule { }
