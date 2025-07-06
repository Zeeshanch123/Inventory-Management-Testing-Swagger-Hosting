import { Controller, Get, Post, Body, Param, Put, Delete, ParseUUIDPipe } from '@nestjs/common';
import { SupplierService } from './supplier.service';
import { CreateSupplierDto } from './dto/create-supplier.dto';
import { UpdateSupplierDto } from './dto/update-supplier.dto';
import { NormalResponse } from '../common/normal-response';
import { Supplier } from './entity/supplier.entity';

@Controller('suppliers')
export class SupplierController {
    constructor(private readonly supplierService: SupplierService) { }

    @Post()
    async create(@Body() dto: CreateSupplierDto): Promise<NormalResponse<Supplier>> {
        return await this.supplierService.create(dto);
    }

    @Get()
    async findAll(): Promise<NormalResponse<Supplier[]>> {
        return await this.supplierService.findAll();
    }

    @Get(':id')
    async findOne(@Param('id', ParseUUIDPipe) id: string): Promise<NormalResponse<Supplier>> {
        return await this.supplierService.findOne(id);
    }

    @Put(':id')
    async update(@Param('id', ParseUUIDPipe) id: string, @Body() dto: UpdateSupplierDto): Promise<NormalResponse<Supplier | null>> {
        return await this.supplierService.update(id, dto);
    }

    @Delete(':id')
    async remove(@Param('id', ParseUUIDPipe) id: string): Promise<NormalResponse<null>> {
        return await this.supplierService.remove(id);
    }
}
