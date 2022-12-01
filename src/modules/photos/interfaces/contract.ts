import { Photo } from '../infra/Entity';
import { create } from './create';

export interface contract {
    findById(photoId: string): Promise<Photo | undefined>;
    delete(photoId: string): Promise<void>;
    create({ name, productId }: create): Promise<Photo>;
}