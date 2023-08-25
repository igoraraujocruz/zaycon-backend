import { inject, injectable } from 'tsyringe';
import { Banner } from '../infra/Entity';
import { contract as bannerContract } from '../interfaces/contract';
import { create } from '../interfaces/create';
import { contract as storageContract } from '../../../shared/providers/storage/contract';
import { AppError } from '../../../shared/AppError';

@injectable()
export class Upload {
    constructor(
        @inject('Banner')
        private banners: bannerContract,

        @inject('Storage')
        private storage: storageContract,
    ) {}

    async execute({ name, productOrTagUrl }: create): Promise<Banner> {
        if (!name) {
            throw new AppError('name not found');
        }

        await this.storage.saveFile(name);

        const banner = await this.banners.create({
            name,
            productOrTagUrl,
        });

        return banner;
    }
}