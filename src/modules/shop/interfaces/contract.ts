import { Shop } from '../infra/Entity'
import { create } from './create'

export interface contract {
    create({ clientId, typeOfPayment, sellerId }: create): Promise<Shop>;
    getBySellerId(sellerId: string): Promise<Shop | undefined>;
    getById(id: string): Promise<Shop | undefined>;
    getByTxid(txid: string): Promise<Shop | undefined>;
    getAll(): Promise<Shop[]>;
    save(user: Shop): Promise<Shop>;
}