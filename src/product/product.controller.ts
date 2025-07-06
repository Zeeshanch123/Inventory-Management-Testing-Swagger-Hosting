import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
  Delete,
  ParseUUIDPipe,
} from '@nestjs/common';
import { ProductService } from './product.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { ChangeStockDto } from './dto/change-stock.dto';
import { Products } from './entity/product.entity';
import { NormalResponse } from '../common/normal-response';

@Controller('products')
export class ProductController {
  constructor(private readonly productService: ProductService) { }

  @Post()
  async create(
    @Body() createProductDto: CreateProductDto,
  ): Promise<NormalResponse<Products>> {
    return await this.productService.create(createProductDto);
  }

  @Get()
  async findAll(): Promise<NormalResponse<Products[]>> {
    return await this.productService.findAll();
  }

  @Get(':id')
  async findOne(
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<NormalResponse<Products>> {
    return await this.productService.findOne(id);
  }

  @Put(':id')
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateProductDto,
  ): Promise<NormalResponse<Products | null>> {
    return await this.productService.update(id, dto);
  }

  @Delete(':id')
  async remove(
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<NormalResponse<null>> {
    return await this.productService.remove(id);
  }

  @Post(':id/stock')
  async changeStock(
    @Param('id', ParseUUIDPipe) productId: string,
    @Body() dto: ChangeStockDto
  ): Promise<NormalResponse<Products>> {
    return await this.productService.changeStock(productId, dto);
  }
}
