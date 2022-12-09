import { AppError } from '../../../shared/AppError';
import { inject, injectable } from 'tsyringe';
import { Shop } from '../infra/Entity';
import { contract } from '../interfaces/contract';

@injectable()
export class UpdateStatus {
    constructor(
        @inject('Shop')
        private repository: contract,
    ) {}

    async execute(shopId: string, status: string): Promise<Shop> {

        const shop = await this.repository.getById(shopId);

        if(!shop) {
            throw new AppError('Compra não localizada')
        }

        shop.status = status

        await this.repository.save(shop)

        return shop;
    }
}