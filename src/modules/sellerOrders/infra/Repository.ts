import { getRepository, Repository as TypeormRepository } from 'typeorm';
import { contract } from '../interfaces/contract';
import { SellerOrders } from './Entity';
import { create } from '../interfaces/create'

export class Repository implements contract {
    private ormRepository: TypeormRepository<SellerOrders>;

    constructor() {
        this.ormRepository = getRepository(SellerOrders);
    }

    async create({ sellerId, productId, points }: create): Promise<SellerOrders> {
        const item = this.ormRepository.create({ sellerId, productId, points });

        await this.ormRepository.save(item);

        return item;
    }

    async getById(id: string): Promise<SellerOrders | undefined> {
        const item = await this.ormRepository.findOne({
            where: { id }
        })

        return item
    }

    async getAll(): Promise<SellerOrders[]> {
        const item = this.ormRepository.find()

        return item;
    }

    async save(item: SellerOrders): Promise<SellerOrders> {
        return this.ormRepository.save(item);
    }
}