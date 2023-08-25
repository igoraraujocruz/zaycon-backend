import { Banner } from '../infra/Entity';
import { create } from './create';

export interface contract {
    findById(bannerId: string): Promise<Banner | undefined>;
    delete(bannerId: string): Promise<void>;
    create({ name, productOrTagUrl }: create): Promise<Banner>;
    getAll(): Promise<Banner[]>;
}