import { inject, injectable } from 'tsyringe';
import { contract } from '../interfaces/contract';
import { Product } from '../infra/Entity';

@injectable()
export class GetBySlug{
    constructor(
        @inject('Product')
        private repository: contract,
    ) {}

    async execute(productSlug: string): Promise<Product | undefined> {
        const items = await this.repository.findBySlug(productSlug);

        return items;
    }
}