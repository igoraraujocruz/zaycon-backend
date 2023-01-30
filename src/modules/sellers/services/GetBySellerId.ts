import { inject, injectable } from 'tsyringe';
import { contract } from '../interfaces/contract';
import { Seller } from '../infra/Entity';

@injectable()
export class GetBySellerId {
    constructor(
        @inject('Seller')
        private repository: contract,
    ) {}

    async execute(sellerId: string): Promise<Seller | undefined> {
        const item = await this.repository.findById(sellerId);

        return item;
    }
}