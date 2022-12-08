import { inject, injectable } from 'tsyringe';
import { contract } from '../interfaces/contract';
import { Seller } from '../infra/Entity';

@injectable()
export class GetBySellerName {
    constructor(
        @inject('Seller')
        private repository: contract,
    ) {}

    async execute(sellerName: string): Promise<Seller[] | undefined> {
        const item = await this.repository.getBySellerName(sellerName);

        return item;
    }
}