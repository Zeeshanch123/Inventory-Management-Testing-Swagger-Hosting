import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, OneToMany } from 'typeorm';
import { Products } from '../../product/entity/product.entity';

@Entity()
export class Supplier {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 100 })
  name: string;

  @Column({ unique: true, nullable: false })
  contact_email: string;

  @CreateDateColumn()
  created_at: Date;

  @OneToMany(() => Products, p => p.supplier)
  products: Products[];
}
