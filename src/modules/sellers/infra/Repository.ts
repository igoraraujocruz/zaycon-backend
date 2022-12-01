import { getRepository, Repository as TypeormRepository } from 'typeorm';
import { contract } from '../interfaces/contract';
import { Seller } from './Entity';
import { create } from '../interfaces/create'

export class Repository implements contract {
    private ormRepository: TypeormRepository<Seller>;

    constructor() {
        this.ormRepository = getRepository(Seller);
    }

    async create({ name, password, email, numberPhone, username, birthday }: create): Promise<Seller> {
        const item = this.ormRepository.create({ name, password, email, numberPhone, username, birthday });

        await this.ormRepository.save(item);

        return item;
    }

    async findByUsername(username: string): Promise<Seller | undefined> {
        const item = this.ormRepository.findOne({
            where: { username }
        })

        return item
    }

    async findById(id: string): Promise<Seller | undefined> {
        const item = this.ormRepository.findOne({
            where: { id }
        })

        return item
    }

    async getAll(): Promise<Seller[]> {
        const item = this.ormRepository.find()

        return item;
    }

    async save(item: Seller): Promise<Seller> {
        return this.ormRepository.save(item);
    }
}