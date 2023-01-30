import { inject, injectable } from 'tsyringe';
import { SellerOrders } from '../infra/Entity';
import { contract } from '../interfaces/contract';

@injectable()
export class GetAll {
    constructor(
        @inject('SellerOrders')
        private repository: contract,
    ) {}

    async execute(): Promise<SellerOrders[]> {

        const item = await this.repository.getAll();

        return item;
    }
}