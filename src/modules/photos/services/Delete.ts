import { inject, injectable } from 'tsyringe';
import { contract as photoContract } from '../interfaces/contract';
import { contract as storageContract } from '../../../shared/providers/storage/contract';
import { AppError } from '../../../shared/AppError';

@injectable()
export class Delete {
    constructor(
        @inject('Photo')
        private photos: photoContract,

        @inject('Storage')
        private storage: storageContract,
    ) {}

    async execute(id: string): Promise<void> {
        const photo = await this.photos.findById(id);

        if (!photo) {
            throw new AppError('photo not found');
        }

        await this.photos.delete(photo.id);

        await this.storage.deleteFile(photo.name);
    }
}