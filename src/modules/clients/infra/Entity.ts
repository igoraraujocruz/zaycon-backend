import {
    Entity,
    Column,
    PrimaryGeneratedColumn,
    CreateDateColumn,
    UpdateDateColumn,
    DeleteDateColumn,
    OneToMany,
    JoinTable,
} from 'typeorm';
import { Exclude } from 'class-transformer';
import { Shop } from '../../shop/infra/Entity';

@Entity('clients')
export class Client {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    name: string;

    @Column()
    address: string;

    @Column()
    cep: string;

    @Column()
    email: string;

    @Column()
    numberPhone: string;

    @OneToMany(() => Shop, shop => shop.client)
    shop: Shop[];

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

    @DeleteDateColumn()
    @Exclude()
    deletedAt?: Date;
}