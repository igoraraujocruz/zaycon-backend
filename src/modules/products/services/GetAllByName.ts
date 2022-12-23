import { inject, injectable } from 'tsyringe';
import { contract } from '../interfaces/contract';
import { Product } from '../infra/Entity';
import { AppError } from '../../../shared/AppError';

@injectable()
export class GetAllByName {
    constructor(
        @inject('Product')
        private repository: contract,
    ) {}

    async execute(option: string): Promise<Product[] | undefined> {
        const products = await this.repository.findAllByName(option);

        if(products.length <= 0) {
            throw new AppError('Nenhum produto encontrado')
        }

        return products;
    }
}