import { inject, injectable } from 'tsyringe';
import { SellerOrders } from '../infra/Entity';
import { contract } from '../interfaces/contract';
import { contract as productContract } from '../../products/interfaces/contract';
import { contract as sellerContract } from '../../sellers/interfaces/contract';
import { create } from '../interfaces/create';
import { AppError } from '../../../shared/AppError';

@injectable()
export class Create {
    constructor(
        @inject('SellerOrders')
        private repository: contract,
        @inject('Product')
        private product: productContract,
        @inject('Seller')
        private seller: sellerContract,
    ) {}

    async execute({
        sellerId, productId  
    }: create): Promise<any> {

        const seller = await this.seller.findById(sellerId)

        if (!seller) {
            throw new AppError('Vendedor não encontrado')
        }

        if (productId) {
            const product = await this.product.findById(productId)

            if (!product) {
                throw new AppError('Produto não encontrado')
            }
        
            if (seller?.points < product?.points) {  
                throw new AppError('Quantidade de pontos insuficiente')
            }

            seller.points -= product.points

            await this.seller.save(seller)

            const item = await this.repository.create({
                productId, sellerId, points: product.points
            });

            return item;

        }

        if(seller.points <= 0) {
            throw new AppError('Você não tem pontos para trocar')
        }

        const sellerPoints = seller.points

        seller.points = 0

        await this.seller.save(seller)

        const item = await this.repository.create({
            productId, sellerId, points: sellerPoints
        });

        return item;
        
    }
}