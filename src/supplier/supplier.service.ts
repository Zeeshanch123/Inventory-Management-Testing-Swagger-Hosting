import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Supplier } from './entity/supplier.entity';
import { CreateSupplierDto } from './dto/create-supplier.dto';
import { UpdateSupplierDto } from './dto/update-supplier.dto';
import { NormalResponse } from '../common/normal-response';

@Injectable()
export class SupplierService {
    constructor(
        @InjectRepository(Supplier)
        private supplierRepo: Repository<Supplier>,
    ) { }

    async create(dto: CreateSupplierDto): Promise<NormalResponse<Supplier>> {
        try {
            const supplier = this.supplierRepo.create(dto);
            const saved = await this.supplierRepo.save(supplier);
            return new NormalResponse(saved, 'Supplier created successfully');
        } catch (err) {
            throw new BadRequestException(err.message);
        }
    }

    async findAll(): Promise<NormalResponse<Supplier[]>> {
        try {
            const suppliers = await this.supplierRepo.find({ relations: ['products'] });
            return new NormalResponse(suppliers, 'Fetched all suppliers successfully');
        } catch (err) {
            throw new BadRequestException(err.message);
        }
    }

    async findOne(id: string): Promise<NormalResponse<Supplier>> {
        try {
            const supplier = await this.supplierRepo.findOne({ where: { id }, relations: ['products'] });
            if (!supplier) throw new NotFoundException('Supplier not found');
            return new NormalResponse(supplier, 'Fetched supplier successfully');
        } catch (err) {
            throw new BadRequestException(err.message);
        }
    }

    async update(id: string, dto: UpdateSupplierDto): Promise<NormalResponse<Supplier | null>> {
        try {
            const updateResult = await this.supplierRepo.update(id, dto);
            if (updateResult.affected === 0) {
                throw new NotFoundException('Supplier not found');
            }
            const supplier = await this.supplierRepo.findOne({ where: { id }, relations: ['products'] });
            return new NormalResponse(supplier, 'Supplier updated successfully');
        } catch (err) {
            throw new BadRequestException(err.message);
        }
    }

    async remove(id: string): Promise<NormalResponse<null>> {
        try {
            const supplier = await this.supplierRepo.findOne({ where: { id } });
            if (!supplier) throw new NotFoundException('Supplier not found');
            await this.supplierRepo.remove(supplier);
            return new NormalResponse(null, 'Supplier removed successfully');
        } catch (err) {
            throw new BadRequestException(err.message);
        }
    }
}
