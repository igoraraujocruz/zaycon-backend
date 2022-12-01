import { inject, injectable } from 'tsyringe';
import { Photo } from '../infra/Entity';
import { contract as photoContract } from '../interfaces/contract';
import { create } from '../interfaces/create';
import { contract as storageContract } from '../../../shared/providers/storage/contract';
import { AppError } from '../../../shared/AppError';

@injectable()
export class Upload {
    constructor(
        @inject('Photo')
        private photos: photoContract,

        @inject('Storage')
        private storage: storageContract,
    ) {}

    async execute({ name, productId }: create): Promise<Photo> {
        if (!name) {
            throw new AppError('name not found');
        }

        await this.storage.saveFile(name);

        const photo = await this.photos.create({
            name,
            productId,
        });

        return photo;
    }
}