import { inject, injectable } from 'tsyringe';
import { contract } from '../interfaces/contract';
import { SellerOrders } from '../infra/Entity';

@injectable()
export class GetBySellerName {
    constructor(
        @inject('SellerOrders')
        private repository: contract,
    ) {}

    async execute(sellerName: string): Promise<SellerOrders[] | undefined> {
        const item = await this.repository.getBySellerName(sellerName);

        return item;
    }
}