import { getRepository, Repository as TypeormRepository } from 'typeorm';
import { contract } from '../interfaces/contract';
import { Banner } from '../infra/Entity';
import { create } from '../interfaces/create';

export class Repository implements contract {
    private ormRepository: TypeormRepository<Banner>;

    constructor() {
        this.ormRepository = getRepository(Banner);
    }

    async create({ name, productOrTagUrl }: create): Promise<Banner> {
        const banner = this.ormRepository.create({ name, productOrTagUrl });

        await this.ormRepository.save(banner);

        return banner;
    }

    async findById(id: string): Promise<Banner | undefined> {
        const item = await this.ormRepository.findOne({
            where: { id },
        });

        return item;
    }

    async getAll(): Promise<Banner[]> {
        const item = await this.ormRepository.find();

        return item;
    }

    async delete(bannerId: string): Promise<void> {
        await this.ormRepository.delete(bannerId);
    }
}