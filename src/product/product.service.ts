import {
    Injectable,
    NotFoundException,
    BadGatewayException,
    BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Products } from './entity/product.entity';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { ChangeStockDto } from './dto/change-stock.dto';
import { StockLog } from '../stock-log/entity/stock-log.entity';
import { NormalResponse } from '../common/normal-response';
import { Supplier } from '../supplier/entity/supplier.entity';

@Injectable()
export class ProductService {
    constructor(
        @InjectRepository(Products)
        private productRepo: Repository<Products>,

        @InjectRepository(StockLog)
        private stockLogRepo: Repository<StockLog>,

        @InjectRepository(Supplier)
        private supplierRepo: Repository<Supplier>,
    ) { }

    async create(
        createProductDto: CreateProductDto,
    ): Promise<NormalResponse<Products>> {
        try {
            const supplier = await this.supplierRepo.findOne({ where: { id: createProductDto.supplierId } });
            if (!supplier) {
                throw new BadRequestException('Supplier not found');
            }
            const product = this.productRepo.create({
                ...createProductDto,
                supplier
            });
            const saved = await this.productRepo.save(product);
            saved.price = Number(Number(saved.price).toFixed(2));
            return new NormalResponse(saved, 'Product created successfully');
        } catch (err) {
            throw new BadGatewayException(err.message);
        }
    }

    async findAll(): Promise<NormalResponse<Products[]>> {
        try {
            const products = await this.productRepo.find({ relations: ['supplier'] });
            return new NormalResponse(products, 'Fetched products successfully');
        } catch (err) {
            throw new BadRequestException(err.message);
        }
    }

    async findOne(id: string): Promise<NormalResponse<Products>> {
        try {
            const product = await this.productRepo.findOne({
                where: { id }, relations: ['supplier']
            });
            if (!product) throw new NotFoundException('Product not found');
            return new NormalResponse(product, 'Fetched product successfully');
        } catch (err) {
            throw new BadRequestException(err.message);
        }
    }

    async update(
        id: string,
        updateDto: UpdateProductDto,
    ): Promise<NormalResponse<Products | null>> {
        try {
            const updateResult = await this.productRepo.update(id, updateDto);
            if (updateResult.affected === 0) {
                throw new NotFoundException('Product not found');
            }
            const product = await this.productRepo.findOne({ where: { id }, relations: ['supplier'] });
            return new NormalResponse(product, 'Product updated successfully');
        } catch (err) {
            throw new BadRequestException(err.message);
        }
    }

    async remove(id: string): Promise<NormalResponse<null>> {
        try {
            const product = await this.productRepo.findOne({
                where: { id }, relations: ['supplier']
            });
            if (!product) throw new NotFoundException('Product not found');
            await this.productRepo.remove(product);
            return new NormalResponse(null, 'Product removed successfully');
        } catch (err) {
            throw new BadRequestException(err.message);
        }
    }

    async changeStock(productId: string, dto: ChangeStockDto): Promise<NormalResponse<Products>> {
        try {
            const product = await this.productRepo.findOne({ where: { id: productId }, relations: ['supplier'] });
            if (!product) throw new NotFoundException('Product not found');

            const updatedQuantity = product.quantity + dto.change;
            if (updatedQuantity < 0) {
                throw new BadRequestException('Insufficient stock for this operation.');
            }

            product.quantity = updatedQuantity;
            await this.productRepo.save(product);

            const log = this.stockLogRepo.create({
                product,
                change: dto.change,
                reason: dto.reason,
            });
            await this.stockLogRepo.save(log);

            return new NormalResponse(product, 'Stock updated and log created successfully');
        } catch (err) {
            throw new BadGatewayException(err.message);
        }
    }
}
