import { inject, injectable } from 'tsyringe';
import { Order } from '../infra/Entity';
import { contract } from '../interfaces/contract';
import { create } from '../interfaces/create';

@injectable()
export class Create {
    constructor(
        @inject('Order')
        private repository: contract,
    ) {}

    async execute({
        productId, quantity, shopId
    }: create): Promise<Order> {

        const item = await this.repository.create({ productId, quantity, shopId });

        return item;
    }
}