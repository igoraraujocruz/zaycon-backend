import auth from '../../../config/auth';
import { AppError } from '../../../shared/AppError';
import dayjs from 'dayjs';
import { sign, verify } from 'jsonwebtoken';
import { inject, injectable } from 'tsyringe';
import { contract } from '../interfaces/contract';

interface IPayload {
    sub: string;
    email: string;
}

interface ITokenResponse {
    token: string;
    refreshToken: string;
}

@injectable()
export class Refresh {
    constructor(
        @inject('Token')
        private repository: contract,
    ) {}

    async execute(newRefreshToken: string): Promise<ITokenResponse> {
        const { email, sub } = verify(
            newRefreshToken,
            auth.jwt.refreshTokenSecret,
        ) as IPayload;

        const sellerId = sub;

        const userToken =
            await this.repository.findByUserIdAndRefreshToken(
                sellerId,
                newRefreshToken,
            );

        if (!userToken) {
            throw new AppError('Refresh Token does not exists!');
        }

        await this.repository.deleteById(userToken.id);

        const refreshToken = sign({ email }, auth.jwt.refreshTokenSecret, {
            subject: sub,
            expiresIn: auth.jwt.expiresInRefreshToken,
        });

        const date = dayjs().add(1, 'd');

        await this.repository.create({
            refreshToken,
            sellerId,
            expiresDate: date.toDate(),
        });

        const newToken = sign({}, auth.jwt.secret, {
            subject: sellerId,
            expiresIn: auth.jwt.expiresIn,
        });

        return {
            refreshToken,
            token: newToken,
        };
    }
}