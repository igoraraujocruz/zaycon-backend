import { getRepository, Repository as TypeormRepository } from 'typeorm';
import { contract } from '../interfaces/contract';
import { Order } from './Entity';
import { create } from '../interfaces/create'

export class Repository implements contract {
    private ormRepository: TypeormRepository<Order>;

    constructor() {
        this.ormRepository = getRepository(Order);
    }

    async create({ productId, quantity, shopId }: create): Promise<Order> {
        const item = this.ormRepository.create({ productId, quantity, shopId });

        await this.ormRepository.save(item);

        return item;
    }

    async getAll(): Promise<Order[]> {
        const item = this.ormRepository.find();

        return item;
    }

    async getBySellerId(sellerId: string): Promise<Order | undefined> {
        const item = this.ormRepository.findOne({
            where: { sellerId }
        })

        return item;
    }

    async save(item: Order): Promise<Order> {
        return this.ormRepository.save(item);
    }
}