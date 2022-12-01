import { getRepository, Repository as TypeormRepository } from 'typeorm';
import { contract } from '../interfaces/contract';
import { Token } from './Entity';
import { create } from '../interfaces/create';

export class Repository implements contract {
    private ormRepository: TypeormRepository<Token>;

    constructor() {
        this.ormRepository = getRepository(Token);
    }

    async findByUserIdAndRefreshToken(
        sellerId: string,
        refreshToken: string,
    ): Promise<Token | undefined> {

        const usersTokens = await this.ormRepository.findOne({
            sellerId,
            refreshToken,
        });

        return usersTokens;
    }

    async create({
        expiresDate,
        refreshToken,
        sellerId,
    }: create): Promise<Token> {
        const userToken = this.ormRepository.create({
            expiresDate,
            refreshToken,
            sellerId,
        });

        await this.ormRepository.save(userToken);

        return userToken;
    }

    async findByRefreshToken(
        refreshToken: string,
    ): Promise<Token | undefined> {
        const userToken = await this.ormRepository.findOne({
            where: { refreshToken },
        });
        return userToken;
    }

    async deleteById(id: string): Promise<void> {
        await this.ormRepository.delete(id);
    }
}