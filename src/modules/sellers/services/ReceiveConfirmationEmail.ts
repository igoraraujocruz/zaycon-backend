import { inject, injectable } from 'tsyringe';
import { contract } from '../interfaces/contract';
import { AppError } from '../../../shared/AppError';
import { contract as tokenContract } from '../../sessions/interfaces/contract'

@injectable()
export class ReceiveConfirmationEmail {
    constructor(
        @inject('Seller')
        private seller: contract,
        @inject('Token')
        private token: tokenContract,
    ) {}

    async execute(token: string): Promise<void> {

        const sellerToken = await this.token.findByRefreshToken(token)

        if (!sellerToken) {
            throw new AppError('Token invalid');
        }

        const seller = await this.seller.findById(sellerToken.sellerId)

        if (!seller) {
            throw new AppError('Vendedor não encontrado', 401);
        }

        seller.emailConfirm = true

        await this.seller.save(seller)

        await this.token.deleteById(sellerToken.id)
    }
}