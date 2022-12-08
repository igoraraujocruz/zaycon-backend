import { Seller } from '../infra/Entity'
import { create } from './create'

export interface contract {
    create({ name,email,numberPhone,password,username}: create): Promise<Seller>;
    getBySellerName(sellerName: string): Promise<Seller[] | undefined>;
    getBySellerUsername(sellerUsername: string): Promise<Seller | undefined>;
    getByEmail(email: string): Promise<Seller | undefined>;
    getByNumberPhone(numberPhone: string): Promise<Seller | undefined>;
    getAll(): Promise<Seller[]>
    findById(id: string): Promise<Seller | undefined>;
    save(user: Seller): Promise<Seller>;
}