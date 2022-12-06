import {
    Entity,
    Column,
    PrimaryGeneratedColumn,
    CreateDateColumn,
    UpdateDateColumn,
    DeleteDateColumn,
    ManyToOne,
    JoinColumn,
    OneToMany,
} from 'typeorm';
import { Exclude } from 'class-transformer';
import { Client } from '../../clients/infra/Entity';
import { Seller } from '../../sellers/infra/Entity';
import { Order } from '../../orders/infra/Entity';

@Entity('shop')
export class Shop {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    typeOfPayment: string;

    @Column()
    referenceId: string;

    @Column()
    paid: boolean;

    @Column()
    socketId: string;

    @Column()
    clientId: string;

    @ManyToOne(() => Client, client => client.shop, {
        eager: true
    })
    @JoinColumn()
    client: Client;

    @Column()
    sellerId: string;

    @ManyToOne(() => Seller, seller => seller.shop)
    @JoinColumn()
    seller: Seller;

    @OneToMany(() => Order, order => order.shop, {
        eager: true,
    })
    order: Order[];

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

    @DeleteDateColumn()
    @Exclude()
    deletedAt?: Date;
}