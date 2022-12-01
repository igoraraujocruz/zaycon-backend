import {
    Entity,
    Column,
    PrimaryGeneratedColumn,
    CreateDateColumn,
    DeleteDateColumn,
    ManyToOne,
    JoinColumn,
} from 'typeorm';
import { Exclude, Expose } from 'class-transformer';
import { Product } from '../../products/infra/Entity';
import uploadConfig from '../../../config/upload';

@Entity('photos')
export class Photo {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    @Exclude()
    name: string;

    @Column()
    @Exclude()
    productId: string;

    @ManyToOne(() => Product)
    @JoinColumn({ name: 'productId' })
    product: Product;

    @Expose({ name: 'url' })
    getAvatarUrl(): string | null {
        if (!this.name) {
            return null;
        }

        switch (uploadConfig.driver) {
            case 'local':
                return `${process.env.API_HOST}/photos/${this.name}`;
            case 's3':
                return `https://${uploadConfig.config.aws.bucket}.s3.amazonaws.com/${this.name}`;
            default:
                return null;
        }
    }

    @CreateDateColumn()
    @Exclude()
    createdAt: Date;

    @DeleteDateColumn()
    @Exclude()
    deletedAt?: Date;
}