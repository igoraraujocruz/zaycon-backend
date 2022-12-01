import {
    Entity,
    Column,
    PrimaryGeneratedColumn,
    CreateDateColumn,
    JoinColumn,
    ManyToMany,
} from 'typeorm';
import { Seller } from '../../sellers/infra/Entity';

@Entity('tokens')
export class Token {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    refreshToken: string;

    @Column()
    sellerId: string;

    @ManyToMany(() => Seller)
    @JoinColumn()
    seller: Seller;

    @Column()
    expiresDate: Date;

    @CreateDateColumn()
    createdAt: Date;
}