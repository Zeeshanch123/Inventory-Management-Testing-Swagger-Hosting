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
import { ProductService } from './product.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { ChangeStockDto } from './dto/change-stock.dto';
import { Products } from './entity/product.entity';
import { NormalResponse } from '../common/normal-response';

@ApiTags('Products')
@Controller('products')
export class ProductController {
  constructor(private readonly productService: ProductService) { }

  @Post()
  @ApiOperation({ 
    summary: 'Create a new product',
    description: 'Creates a new product with the provided details. Requires a valid supplier ID.'
  })
  @ApiBody({ type: CreateProductDto })
  @ApiCreatedResponse({ 
    description: 'Product created successfully',
    type: NormalResponse
  })
  @ApiBadRequestResponse({ 
    description: 'Invalid input data or supplier not found'
  })
  async create(
    @Body() createProductDto: CreateProductDto,
  ): Promise<NormalResponse<Products>> {
    return await this.productService.create(createProductDto);
  }

  @Get()
  @ApiOperation({ 
    summary: 'Get all products',
    description: 'Retrieves a list of all products with their supplier information.'
  })
  @ApiOkResponse({ 
    description: 'Products retrieved successfully',
    type: NormalResponse
  })
  async findAll(): Promise<NormalResponse<Products[]>> {
    return await this.productService.findAll();
  }

  @Get(':id')
  @ApiOperation({ 
    summary: 'Get a product by ID',
    description: 'Retrieves a specific product by its UUID.'
  })
  @ApiParam({ 
    name: 'id', 
    description: 'Product UUID',
    example: '123e4567-e89b-12d3-a456-426614174000'
  })
  @ApiOkResponse({ 
    description: 'Product retrieved successfully',
    type: NormalResponse
  })
  @ApiNotFoundResponse({ 
    description: 'Product not found'
  })
  async findOne(
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<NormalResponse<Products>> {
    return await this.productService.findOne(id);
  }

  @Put(':id')
  @ApiOperation({ 
    summary: 'Update a product',
    description: 'Updates an existing product with the provided data.'
  })
  @ApiParam({ 
    name: 'id', 
    description: 'Product UUID',
    example: '123e4567-e89b-12d3-a456-426614174000'
  })
  @ApiBody({ type: UpdateProductDto })
  @ApiOkResponse({ 
    description: 'Product updated successfully',
    type: NormalResponse
  })
  @ApiNotFoundResponse({ 
    description: 'Product not found'
  })
  @ApiBadRequestResponse({ 
    description: 'Invalid input data'
  })
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateProductDto,
  ): Promise<NormalResponse<Products | null>> {
    return await this.productService.update(id, dto);
  }

  @Delete(':id')
  @ApiOperation({ 
    summary: 'Delete a product',
    description: 'Removes a product from the system.'
  })
  @ApiParam({ 
    name: 'id', 
    description: 'Product UUID',
    example: '123e4567-e89b-12d3-a456-426614174000'
  })
  @ApiOkResponse({ 
    description: 'Product deleted successfully',
    type: NormalResponse
  })
  @ApiNotFoundResponse({ 
    description: 'Product not found'
  })
  async remove(
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<NormalResponse<null>> {
    return await this.productService.remove(id);
  }

  @Post(':id/stock')
  @ApiOperation({ 
    summary: 'Change product stock',
    description: 'Updates the stock quantity of a product and creates a stock log entry.'
  })
  @ApiParam({ 
    name: 'id', 
    description: 'Product UUID',
    example: '123e4567-e89b-12d3-a456-426614174000'
  })
  @ApiBody({ type: ChangeStockDto })
  @ApiOkResponse({ 
    description: 'Stock updated and log created successfully',
    type: NormalResponse
  })
  @ApiNotFoundResponse({ 
    description: 'Product not found'
  })
  @ApiBadRequestResponse({ 
    description: 'Insufficient stock for this operation'
  })
  async changeStock(
    @Param('id', ParseUUIDPipe) productId: string,
    @Body() dto: ChangeStockDto
  ): Promise<NormalResponse<Products>> {
    return await this.productService.changeStock(productId, dto);
  }
}
