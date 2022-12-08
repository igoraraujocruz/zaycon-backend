import { inject, injectable } from 'tsyringe';
import { contract } from '../interfaces/contract';
import { Seller } from '../infra/Entity';

@injectable()
export class GetBySellerUsername {
    constructor(
        @inject('Seller')
        private repository: contract,
    ) {}

    async execute(sellerUsername: string): Promise<Seller | undefined> {
        const item = await this.repository.getBySellerUsername(sellerUsername);

        return item;
    }
}