import { AppError } from '../../../shared/AppError';
import { inject, injectable } from 'tsyringe';
import { Shop } from '../infra/Entity';
import { contract } from '../interfaces/contract';

@injectable()
export class SaveReferenceId {
    constructor(
        @inject('Shop')
        private repository: contract,
    ) {}

    async execute(txid: string, id: string): Promise<Shop> {

        const shop = await this.repository.getById(id)

        if (!shop) {
            throw new AppError('Shop not found');
        }

        shop.referenceId = txid

        return this.repository.save(shop)
    }
}