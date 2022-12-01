import { getRepository, Repository as TypeormRepository } from 'typeorm';
import { contract } from '../interfaces/contract';
import { Photo } from '../infra/Entity';
import { create } from '../interfaces/create';

export class Repository implements contract {
    private ormRepository: TypeormRepository<Photo>;

    constructor() {
        this.ormRepository = getRepository(Photo);
    }

    async create({ name, productId }: create): Promise<Photo> {
        const photo = this.ormRepository.create({ name, productId });

        await this.ormRepository.save(photo);

        return photo;
    }

    async findById(id: string): Promise<Photo | undefined> {
        const item = await this.ormRepository.findOne({
            where: { id },
        });

        return item;
    }

    async delete(photoId: string): Promise<void> {
        await this.ormRepository.delete(photoId);
    }
}