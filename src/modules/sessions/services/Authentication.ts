import { sign } from 'jsonwebtoken';
import auth from '../../../config/auth';
import { contract } from '../../sellers/interfaces/contract';
import { AppError } from '../../../shared/AppError';
import { contract as hashContract } from '../../../shared/providers/hash/contract';
import { injectable, inject } from 'tsyringe';
import dayjs from 'dayjs';
import { contract as tokenContract } from '../interfaces/contract';

interface IRequest {
    username: string;
    password: string;
}

interface IResponse {
    seller: {
        name: string;
        username: string;
        email: string;
        isAdmin: boolean;
    };
    token: string;
    refreshToken: string;
}

@injectable()
export class Authentication {
    constructor(
        @inject('Seller')
        private seller: contract,

        @inject('Hash')
        private hash: hashContract,

        @inject('Token')
        private token: tokenContract,
    ) {}

    public async execute({ username, password }: IRequest): Promise<IResponse> {
        const seller = await this.seller.findByUsername(username);

        if (!seller) {
            throw new AppError('Username ou a senha invalidos', 401);
        }

        const passwordMatched = await this.hash.compareHash(
            password,
            seller.password,
        );

        if (!passwordMatched) {
            throw new AppError('Username ou a senha invalidos', 401);
        }

        const { secret, expiresIn, refreshTokenSecret, expiresInRefreshToken } =
            auth.jwt;

        const token = sign({}, secret, {
            subject: seller.id,
            expiresIn,
        });

        const refreshToken = sign({ username }, refreshTokenSecret, {
            subject: seller.id,
            expiresIn: expiresInRefreshToken,
        });

        const date = dayjs().add(15, 'm');

        await this.token.create({
            expiresDate: date.toDate(),
            refreshToken,
            sellerId: seller.id,
        });

        const tokenReturn: IResponse = {
            token,
            seller: {
                name: seller.name,
                username: seller.username,
                email: seller.email,
                isAdmin: seller.isAdmin,
            },
            refreshToken,
        };

        return tokenReturn;
    }
}    