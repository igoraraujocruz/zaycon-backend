import { inject, injectable } from 'tsyringe';
import { contract } from '../interfaces/contract';
import { Shop } from '../infra/Entity';

@injectable()
export class GetBySellerId {
    constructor(
        @inject('Shop')
        private repository: contract,
    ) {}

    async execute(sellerId: string): Promise<Shop | undefined> {
        const item = await this.repository.getBySellerId(sellerId);

        return item;
    }
}