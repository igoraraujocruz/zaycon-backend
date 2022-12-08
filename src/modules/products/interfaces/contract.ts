import { Product } from '../infra/Entity'
import { create } from './create'

export interface contract {
    create({ name, description, amount, price, slug}: create): Promise<Product>;
    getAll(): Promise<Product[]>
    findBySlug(slug: string): Promise<Product | undefined>;
    findById(productId: string): Promise<Product | undefined>;
    findAllByName(name: string): Promise<Product[]>;
    save(user: Product): Promise<Product>;
}