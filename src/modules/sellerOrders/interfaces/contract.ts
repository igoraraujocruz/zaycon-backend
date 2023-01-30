import { SellerOrders } from '../infra/Entity'
import { create } from './create'

export interface contract {
    create({ sellerId, productId, points }: create): Promise<SellerOrders>;
    getAll(): Promise<SellerOrders[]>
    getById(sellerOrder: string): Promise<SellerOrders | undefined>
    save(user: SellerOrders): Promise<SellerOrders>;
}