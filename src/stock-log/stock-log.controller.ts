import { Controller, Get, Post, Body, Param, Query } from '@nestjs/common';
import { 
  ApiTags, 
  ApiOperation, 
  ApiResponse, 
  ApiParam, 
  ApiBody,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiNotFoundResponse,
  ApiBadRequestResponse
} from '@nestjs/swagger';
import { StockLogService } from './stock-log.service';
import { CreateStockLogDto } from './dto/create-stock-log.dto';
import { NormalResponse } from '../common/normal-response';
import { StockLog } from './entity/stock-log.entity';

@ApiTags('Stock Logs')
@Controller('stock-logs')
export class StockLogController {
  constructor(private readonly stockLogService: StockLogService) { }

  @Post()
  @ApiOperation({ 
    summary: 'Create a new stock log',
    description: 'Creates a new stock log entry and optionally updates the product stock quantity.'
  })
  @ApiBody({ type: CreateStockLogDto })
  @ApiCreatedResponse({ 
    description: 'Stock log created successfully',
    type: NormalResponse
  })
  @ApiBadRequestResponse({ 
    description: 'Invalid input data, product not found, or insufficient stock'
  })
  async create(@Body() dto: CreateStockLogDto): Promise<NormalResponse<StockLog>> {
    return await this.stockLogService.create(dto);
  }

  @Get()
  @ApiOperation({ 
    summary: 'Get all stock logs',
    description: 'Retrieves a list of all stock log entries with their associated product information.'
  })
  @ApiOkResponse({ 
    description: 'Stock logs retrieved successfully',
    type: NormalResponse
  })
  async findAll(): Promise<NormalResponse<StockLog[]>> {
    return await this.stockLogService.findAll();
  }

  @Get(':productId')
  @ApiOperation({ 
    summary: 'Get stock logs by product ID',
    description: 'Retrieves all stock log entries for a specific product, ordered by most recent first.'
  })
  @ApiParam({ 
    name: 'productId', 
    description: 'Product UUID',
    example: '123e4567-e89b-12d3-a456-426614174000'
  })
  @ApiOkResponse({ 
    description: 'Product stock logs retrieved successfully',
    type: NormalResponse
  })
  @ApiNotFoundResponse({ 
    description: 'Product not found'
  })
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
