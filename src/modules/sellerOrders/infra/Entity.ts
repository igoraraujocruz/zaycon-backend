import {
    Entity,
    Column,
    PrimaryGeneratedColumn,
    CreateDateColumn,
    UpdateDateColumn,
    DeleteDateColumn,
    ManyToOne,
    JoinColumn,
} from 'typeorm';
import { Exclude } from 'class-transformer';
import { Seller } from '../../sellers/infra/Entity';
import { Product } from '../../products/infra/Entity';

@Entity('sellerOrders')
export class SellerOrders {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    answered: boolean;
    
    @Column()
    productId: string;

    @Column()
    points: number;

    @ManyToOne(() => Product, product => product.sellerOrders, {
        eager: true
    })
    @JoinColumn()
    product: Product;

    @Column()
    sellerId: string;

    @ManyToOne(() => Seller, seller => seller.sellerOrders)
    @JoinColumn()
    seller: Seller;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

    @DeleteDateColumn()
    @Exclude()
    deletedAt?: Date;
}