import { Token } from '../infra/Entity';
import { create } from './create';

export interface contract {
    create({
        expiresDate,
        refreshToken,
        sellerId,
    }: create): Promise<Token>;

    findByUserIdAndRefreshToken(
        sellerId: string,
        refreshToken: string,
    ): Promise<Token | undefined>;

    deleteById(id: string): Promise<void>;

    findByRefreshToken(refreshToken: string): Promise<Token | undefined>;
}