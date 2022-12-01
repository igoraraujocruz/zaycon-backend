import { getRepository, Repository as TypeormRepository } from 'typeorm';
import { contract } from '../interfaces/contract';
import { Shop } from './Entity';
import { create } from '../interfaces/create'

export class Repository implements contract {
    private ormRepository: TypeormRepository<Shop>;

    constructor() {
        this.ormRepository = getRepository(Shop);
    }

    async create({ clientId, typeOfPayment, sellerId }: create): Promise<Shop> {
        const item = this.ormRepository.create({ clientId, typeOfPayment, sellerId });

        await this.ormRepository.save(item);

        return item;
    }

    async getAll(): Promise<Shop[]> {
        const item = await this.ormRepository.find();

        return item;
    }

    async getBySellerId(sellerId: string): Promise<Shop | undefined> {
        const item = await this.ormRepository.findOne({
            where: { sellerId }
        })

        return item;
    }

    async getById(id: string): Promise<Shop | undefined> {
        const item = await this.ormRepository.findOne({
            where: { id }
        })

        return item;
    }

    async getByTxid(txid: string): Promise<Shop | undefined> {
        const item = await this.ormRepository.findOne({
            where: { txid }
        })

        return item;
    }

    async save(item: Shop): Promise<Shop> {
        return this.ormRepository.save(item);
    }
}