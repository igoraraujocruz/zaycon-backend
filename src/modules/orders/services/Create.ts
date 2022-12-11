import { inject, injectable } from 'tsyringe';
import { Order } from '../infra/Entity';
import { contract } from '../interfaces/contract';
import { create } from '../interfaces/create';
import { contract as productContract } from '../../products/interfaces/contract'
import { AppError } from '../../../shared/AppError';

@injectable()
export class Create {
    constructor(
        @inject('Order')
        private repository: contract,
        @inject('Product')
        private product: productContract,
    ) {}

    async execute({
        productId, quantity, shopId
    }: create): Promise<Order> {

        const product = await this.product.findById(productId)

        if(!product) {
            throw new AppError('Produto não encontrado')
        }

        if(quantity > product.amount) {
            throw new AppError(`Infelizmente não possuímos toda a quantidade desejada, no momento nosso estoque é de ${product.amount} ${product.name}`)
        }

        const item = await this.repository.create({ productId, quantity, shopId });

        return item;
    }
}