import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn, JoinColumn } from 'typeorm';
import { Products } from '../../product/entity/product.entity';

@Entity()
export class StockLog {
    @PrimaryGeneratedColumn('uuid') id: string;

    @Column('int') change: number;

    @Column({ length: 255 }) reason: string;

    @ManyToOne(() => Products, p => p.stock_logs, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'product_id' })
    product: Products;

    @CreateDateColumn() logged_at: Date;
}