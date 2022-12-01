import { inject, injectable } from 'tsyringe';
import { Product } from '../infra/Entity';
import { contract } from '../interfaces/contract';

@injectable()
export class GetAll {
    constructor(
        @inject('Product')
        private repository: contract,
    ) {}

    async execute(): Promise<Product[]> {

        const item = await this.repository.getAll();

        return item;
    }
}