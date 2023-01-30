import {
    Entity,
    Column,
    PrimaryGeneratedColumn,
    CreateDateColumn,
    UpdateDateColumn,
    DeleteDateColumn,
    OneToMany,
    OneToOne,
} from 'typeorm';
import { Exclude } from 'class-transformer';
import { Photo } from '../../photos/infra/Entity';
import { Order } from '../../orders/infra/Entity';
import { SellerOrders } from '../../sellerOrders/infra/Entity';

@Entity('products')
export class Product {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    name: string;

    @Column()
    description: string;

    @Column()
    amount: number;

    @Column()
    category: string;

    @Column()
    price: number;

    @Column()
    destaque: boolean;

    @Column()
    points: number;

    @Column()
    slug: string;

    @OneToMany(() => Photo, photos => photos.product, {
        eager: true,
    })
    photos: Photo[];

    @OneToMany(() => SellerOrders, sellerOrders => sellerOrders.product)
    sellerOrders: SellerOrders[];

    @OneToOne(() => Order, order => order.product)
    order: Order[];

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

    @DeleteDateColumn()
    @Exclude()
    deletedAt?: Date;
}