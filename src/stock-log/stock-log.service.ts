import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { StockLog } from './entity/stock-log.entity';
import { Repository } from 'typeorm';
import { CreateStockLogDto } from './dto/create-stock-log.dto';
import { Products } from '../product/entity/product.entity';
import { NormalResponse } from '../common/normal-response';

@Injectable()
export class StockLogService {
    constructor(
        @InjectRepository(StockLog)
        private stockLogRepo: Repository<StockLog>,
        @InjectRepository(Products)
        private productRepo: Repository<Products>,
    ) { }

    async create(dto: CreateStockLogDto): Promise<NormalResponse<StockLog>> {
        try {
            const product = await this.productRepo.findOne({ where: { id: dto.productId }, relations: ['supplier'] });
            if (!product) {
                throw new NotFoundException('Product not found');
            }

            if (dto.updateStock !== false) {
                const updatedQuantity = product.quantity + dto.change;
                if (updatedQuantity < 0) {
                    throw new BadRequestException('Insufficient stock for this operation. Cannot have negative quantity.');
                }

                product.quantity = updatedQuantity;
                await this.productRepo.save(product);
            }

            const stockLog = this.stockLogRepo.create({
                product,
                change: dto.change,
                reason: dto.reason,
            });
            const savedLog = await this.stockLogRepo.save(stockLog);

            return new NormalResponse(savedLog, 'Stock log created successfully');
        } catch (err) {
            throw new BadRequestException(err.message);
        }
    }

    async findAll(): Promise<NormalResponse<StockLog[]>> {
        try {
            const logs = await this.stockLogRepo.find({ relations: ['product'] });
            return new NormalResponse(logs, 'Fetched all stock logs successfully');
        } catch (err) {
            throw new BadRequestException(err.message);
        }
    }

    async findByProduct(productId: string): Promise<NormalResponse<StockLog[]>> {
        try {
            const logs = await this.stockLogRepo.find({
                where: { product: { id: productId } },
                relations: ['product'],
                order: { logged_at: 'DESC' }
            });
            return new NormalResponse(logs, 'Fetched product stock logs successfully');
        } catch (err) {
            throw new BadRequestException(err.message);
        }
    }


    // Method 1: Raw SQL query using query() method
    // async findByProductRawSQL(productId: string): Promise<NormalResponse<any[]>> {
    //     try {
    //         const logs = await this.stockLogRepo.query(`
    //             SELECT sl.*, p.name as product_name, p.quantity as current_stock
    //             FROM stock_log sl
    //             INNER JOIN products p ON sl.product_id = p.id
    //             WHERE sl.product_id = ?
    //             ORDER BY sl.logged_at DESC
    //         `, [productId]);

    //         return new NormalResponse(logs, 'Fetched product stock logs using raw SQL');
    //     } catch (err) {
    //         throw new BadRequestException(err.message);
    //     }
    // }

    // Method 2: Query Builder (TypeORM's SQL-like syntax)
    // async findByProductQueryBuilder(productId: string): Promise<NormalResponse<StockLog[]>> {
    //     try {
    //         const logs = await this.stockLogRepo
    //             .createQueryBuilder('stockLog')
    //             .leftJoinAndSelect('stockLog.product', 'product')
    //             .where('product.id = :productId', { productId })
    //             .orderBy('stockLog.logged_at', 'DESC')
    //             .getMany();

    //         return new NormalResponse(logs, 'Fetched product stock logs using Query Builder');
    //     } catch (err) {
    //         throw new BadRequestException(err.message);
    //     }
    // }

    // Method 3: Complex SQL with aggregations
    // async getStockSummary(): Promise<NormalResponse<any[]>> {
    //     try {
    //         const summary = await this.stockLogRepo.query(`
    //             SELECT 
    //                 p.id as product_id,
    //                 p.name as product_name,
    //                 p.quantity as current_stock,
    //                 COUNT(sl.id) as total_transactions,
    //                 SUM(CASE WHEN sl.change > 0 THEN sl.change ELSE 0 END) as total_added,
    //                 SUM(CASE WHEN sl.change < 0 THEN ABS(sl.change) ELSE 0 END) as total_removed,
    //                 MAX(sl.logged_at) as last_transaction_date
    //             FROM products p
    //             LEFT JOIN stock_log sl ON p.id = sl.product_id
    //             GROUP BY p.id, p.name, p.quantity
    //             ORDER BY p.name
    //         `);

    //         return new NormalResponse(summary, 'Stock summary generated using raw SQL');
    //     } catch (err) {
    //         throw new BadRequestException(err.message);
    //     }
    // }

    // Method 4: Parameterized query with multiple conditions
    // async findLogsByDateRange(startDate: string, endDate: string, productId?: string): Promise<NormalResponse<any[]>> {
    //     try {
    //         let query = `
    //             SELECT sl.*, p.name as product_name
    //             FROM stock_log sl
    //             INNER JOIN products p ON sl.product_id = p.id
    //             WHERE sl.logged_at BETWEEN ? AND ?
    //         `;
    //         const params = [startDate, endDate];

    //         if (productId) {
    //             query += ` AND sl.product_id = ?`;
    //             params.push(productId);
    //         }

    //         query += ` ORDER BY sl.logged_at DESC`;

    //         const logs = await this.stockLogRepo.query(query, params);
    //         return new NormalResponse(logs, 'Fetched logs by date range using raw SQL');
    //     } catch (err) {
    //         throw new BadRequestException(err.message);
    //     }
    // }

    // Method 5: Using Query Builder with complex joins and conditions
    // async getProductStockHistory(productId: string, limit: number = 10): Promise<NormalResponse<any[]>> {
    //     try {
    //         const history = await this.stockLogRepo
    //             .createQueryBuilder('sl')
    //             .select([
    //                 'sl.id',
    //                 'sl.change',
    //                 'sl.reason',
    //                 'sl.logged_at',
    //                 'p.name as productName',
    //                 'p.quantity as currentStock'
    //             ])
    //             .leftJoin('sl.product', 'p')
    //             .where('p.id = :productId', { productId })
    //             .orderBy('sl.logged_at', 'DESC')
    //             .limit(limit)
    //             .getRawMany();

    //         return new NormalResponse(history, 'Product stock history using Query Builder');
    //     } catch (err) {
    //         throw new BadRequestException(err.message);
    //     }
    // }

}
