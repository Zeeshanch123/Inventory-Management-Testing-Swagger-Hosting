import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    ManyToOne,
    CreateDateColumn,
    OneToMany,
    Check,
    JoinColumn,
} from 'typeorm';
import { Supplier } from '../../supplier/entity/supplier.entity'
import { StockLog } from '../../stock-log/entity/stock-log.entity'

@Check(`"price" > 0`)
@Check(`"quantity" >= 0`)
@Entity()
export class Products {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ length: 100 })
    name: string;

    @Column('text')
    description: string;

    @Column({ default: true })
    in_stock: boolean;

    @Column('int', { default: 0 })
    quantity: number;

    @Column('decimal', { precision: 10, scale: 2 })
    price: number;

    @CreateDateColumn()
    created_at: Date;

    @ManyToOne(() => Supplier, (s) => s.products, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'supplier_id' })
    supplier: Supplier;

    @OneToMany(() => StockLog, (sl) => sl.product)
    stock_logs: StockLog[];

}