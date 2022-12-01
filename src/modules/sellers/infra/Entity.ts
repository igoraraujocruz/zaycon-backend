import {
    Entity,
    Column,
    PrimaryGeneratedColumn,
    CreateDateColumn,
    UpdateDateColumn,
    DeleteDateColumn,
    OneToMany,
} from 'typeorm';
import { Exclude } from 'class-transformer';
import { Shop } from '../../shop/infra/Entity';

@Entity('sellers')
export class Seller {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    name: string;

    @Column()
    username: string;

    @Column()
    points: number;

    @Column()
    email: string;

    @Column()
    numberPhone: string;

    @Column()
    emailConfirm: boolean;
    
    @Column()
    isAdmin: boolean;

    @Column()
    @Exclude()
    password: string;

    @Column()
    birthday: Date;

    @OneToMany(() => Shop, shop => shop.seller, {
        eager: true
    })
    shop: Shop[];

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

    @DeleteDateColumn()
    @Exclude()
    deletedAt?: Date;
}