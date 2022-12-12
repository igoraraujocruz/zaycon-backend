import { injectable, inject } from 'tsyringe';
import { isAfter, addHours } from 'date-fns';
import { AppError } from '../../../shared/AppError';
import { contract as SellerContract } from '../../sellers/interfaces/contract';
import { contract as TokenContract } from '../../sessions/interfaces/contract';
import { contract as HashContract } from '../../../shared/providers/hash/contract';

interface IRequest {
    password: string;
    token: string;
}

@injectable()
export class ResetPassword {
    constructor(
        @inject('Seller')
        private seller: SellerContract,

        @inject('Token')
        private token: TokenContract,

        @inject('Hash')
        private hash: HashContract,
    ) {}

    async execute({ token, password }: IRequest): Promise<void> {
        const sellerToken = await this.token.findByRefreshToken(
            token,
        );

        if (!sellerToken) {
            throw new AppError('Token invalid');
        }

        const user = await this.seller.findById(sellerToken.sellerId);

        if (!user) {
            throw new AppError('User does not exists');
        }

        const tokenCreatedAt = sellerToken.createdAt;
        const compareDate = addHours(tokenCreatedAt, 2);

        if (isAfter(Date.now(), compareDate)) {
            throw new AppError('Token expired');
        }

        user.password = await this.hash.generateHash(password);

        await this.seller.save(user);

        await this.token.deleteById(sellerToken.id);
    }
}