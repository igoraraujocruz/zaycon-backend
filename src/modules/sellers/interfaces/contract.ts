import { Seller } from '../infra/Entity'
import { create } from './create'

export interface contract {
    create({ name,email,numberPhone,password,username}: create): Promise<Seller>;
    findByUsername(username: string): Promise<Seller | undefined>;
    getAll(): Promise<Seller[]>
    findById(id: string): Promise<Seller | undefined>;
    save(user: Seller): Promise<Seller>;
}