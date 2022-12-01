import { inject, injectable } from 'tsyringe';
import { contract } from '../interfaces/contract';
import { Product } from '../infra/Entity';

@injectable()
export class GetAllByName {
    constructor(
        @inject('Product')
        private repository: contract,
    ) {}

    async execute(option: string): Promise<Product[] | undefined> {
        const products = await this.repository.findAllByName(option);

        return products;
    }
}