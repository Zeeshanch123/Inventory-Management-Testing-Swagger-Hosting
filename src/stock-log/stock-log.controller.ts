import { Controller, Get, Post, Body, Param, Query } from '@nestjs/common';
import { StockLogService } from './stock-log.service';
import { CreateStockLogDto } from './dto/create-stock-log.dto';
import { NormalResponse } from '../common/normal-response';
import { StockLog } from './entity/stock-log.entity';

@Controller('stock-logs')
export class StockLogController {
  constructor(private readonly stockLogService: StockLogService) { }

  @Post()
  async create(@Body() dto: CreateStockLogDto): Promise<NormalResponse<StockLog>> {
    return await this.stockLogService.create(dto);
  }

  @Get()
  async findAll(): Promise<NormalResponse<StockLog[]>> {
    return await this.stockLogService.findAll();
  }

  @Get(':productId')
  async findByProduct(@Param('productId') productId: string): Promise<NormalResponse<StockLog[]>> {
    return await this.stockLogService.findByProduct(productId);
  }


  // Raw SQL queries

  // @Get('raw-sql/:productId')
  // async findByProductRawSQL(@Param('productId') productId: string) {
  //   return await this.stockLogService.findByProductRawSQL(productId);
  // }

  // @Get('query-builder/:productId')
  // async findByProductQueryBuilder(@Param('productId') productId: string) {
  //   return await this.stockLogService.findByProductQueryBuilder(productId);
  // }

  // @Get('summary/stock')
  // async getStockSummary() {
  //   return await this.stockLogService.getStockSummary();
  // }

  // @Get('date-range')
  // async findLogsByDateRange(
  //   @Query('startDate') startDate: string,
  //   @Query('endDate') endDate: string,
  //   @Query('productId') productId?: string
  // ) {
  //   return await this.stockLogService.findLogsByDateRange(startDate, endDate, productId);
  // }

  // @Get('history/:productId')
  // async getProductStockHistory(
  //   @Param('productId') productId: string,
  //   @Query('limit') limit?: string
  // ) {
  //   const limitNum = limit ? parseInt(limit) : 10;
  //   return await this.stockLogService.getProductStockHistory(productId, limitNum);
  // }

}
