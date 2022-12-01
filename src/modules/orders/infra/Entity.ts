import {
    Entity,
    Column,
    PrimaryGeneratedColumn,
    CreateDateColumn,
    UpdateDateColumn,
    DeleteDateColumn,
    ManyToMany,
    JoinColumn,
    ManyToOne,
    OneToOne,
} from 'typeorm';
import { Exclude } from 'class-transformer';
import { Product } from '../../products/infra/Entity';
import { Shop } from '../../shop/infra/Entity';

@Entity('orders')
export class Order {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    quantity: number;

    @Column()
    productId: string;

    @OneToOne(() => Product, {
        eager: true
    })
    @JoinColumn({ name: 'productId' })
    product: Product;

    @Column()
    shopId: string;

    @ManyToOne(() => Shop, shop => shop.order)
    @JoinColumn({ name: 'shopId' })
    shop: Shop;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

    @DeleteDateColumn()
    @Exclude()
    deletedAt?: Date;
}