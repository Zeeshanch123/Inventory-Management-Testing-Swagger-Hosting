import { Controller, Get, Post, Body, Param, Put, Delete, ParseUUIDPipe } from '@nestjs/common';
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
import { SupplierService } from './supplier.service';
import { CreateSupplierDto } from './dto/create-supplier.dto';
import { UpdateSupplierDto } from './dto/update-supplier.dto';
import { NormalResponse } from '../common/normal-response';
import { Supplier } from './entity/supplier.entity';

@ApiTags('Suppliers')
@Controller('suppliers')
export class SupplierController {
    constructor(private readonly supplierService: SupplierService) { }

    @Post()
    @ApiOperation({ 
      summary: 'Create a new supplier',
      description: 'Creates a new supplier with the provided details.'
    })
    @ApiBody({ type: CreateSupplierDto })
    @ApiCreatedResponse({ 
      description: 'Supplier created successfully',
      type: NormalResponse
    })
    @ApiBadRequestResponse({ 
      description: 'Invalid input data'
    })
    async create(@Body() dto: CreateSupplierDto): Promise<NormalResponse<Supplier>> {
        return await this.supplierService.create(dto);
    }

    @Get()
    @ApiOperation({ 
      summary: 'Get all suppliers',
      description: 'Retrieves a list of all suppliers with their associated products.'
    })
    @ApiOkResponse({ 
      description: 'Suppliers retrieved successfully',
      type: NormalResponse
    })
    async findAll(): Promise<NormalResponse<Supplier[]>> {
        return await this.supplierService.findAll();
    }

    @Get(':id')
    @ApiOperation({ 
      summary: 'Get a supplier by ID',
      description: 'Retrieves a specific supplier by its UUID.'
    })
    @ApiParam({ 
      name: 'id', 
      description: 'Supplier UUID',
      example: '123e4567-e89b-12d3-a456-426614174000'
    })
    @ApiOkResponse({ 
      description: 'Supplier retrieved successfully',
      type: NormalResponse
    })
    @ApiNotFoundResponse({ 
      description: 'Supplier not found'
    })
    async findOne(@Param('id', ParseUUIDPipe) id: string): Promise<NormalResponse<Supplier>> {
        return await this.supplierService.findOne(id);
    }

    @Put(':id')
    @ApiOperation({ 
      summary: 'Update a supplier',
      description: 'Updates an existing supplier with the provided data.'
    })
    @ApiParam({ 
      name: 'id', 
      description: 'Supplier UUID',
      example: '123e4567-e89b-12d3-a456-426614174000'
    })
    @ApiBody({ type: UpdateSupplierDto })
    @ApiOkResponse({ 
      description: 'Supplier updated successfully',
      type: NormalResponse
    })
    @ApiNotFoundResponse({ 
      description: 'Supplier not found'
    })
    @ApiBadRequestResponse({ 
      description: 'Invalid input data'
    })
    async update(@Param('id', ParseUUIDPipe) id: string, @Body() dto: UpdateSupplierDto): Promise<NormalResponse<Supplier | null>> {
        return await this.supplierService.update(id, dto);
    }

    @Delete(':id')
    @ApiOperation({ 
      summary: 'Delete a supplier',
      description: 'Removes a supplier from the system.'
    })
    @ApiParam({ 
      name: 'id', 
      description: 'Supplier UUID',
      example: '123e4567-e89b-12d3-a456-426614174000'
    })
    @ApiOkResponse({ 
      description: 'Supplier deleted successfully',
      type: NormalResponse
    })
    @ApiNotFoundResponse({ 
      description: 'Supplier not found'
    })
    async remove(@Param('id', ParseUUIDPipe) id: string): Promise<NormalResponse<null>> {
        return await this.supplierService.remove(id);
    }
}
