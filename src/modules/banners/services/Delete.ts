import { inject, injectable } from 'tsyringe';
import { contract as bannerContract } from '../interfaces/contract';
import { contract as storageContract } from '../../../shared/providers/storage/contract';
import { AppError } from '../../../shared/AppError';

@injectable()
export class Delete {
    constructor(
        @inject('Banner')
        private banners: bannerContract,

        @inject('Storage')
        private storage: storageContract,
    ) {}

    async execute(id: string): Promise<void> {
        const banner = await this.banners.findById(id);

        if (!banner) {
            throw new AppError('banner not found');
        }

        await this.banners.delete(banner.id);

        await this.storage.deleteFile(banner.name);
    }
}