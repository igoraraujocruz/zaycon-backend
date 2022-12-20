import { inject, injectable } from 'tsyringe';
import { contract } from '../interfaces/contract';
import { Product } from '../infra/Entity';

@injectable()
export class GetByCategory {
    constructor(
        @inject('Product')
        private repository: contract,
    ) {}

    async execute(category: string): Promise<Product[]> {
        const products = await this.repository.getByCategory(category);

        return products;
    }
}