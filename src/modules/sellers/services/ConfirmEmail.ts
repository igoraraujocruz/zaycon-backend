import { inject, injectable } from 'tsyringe';
import { Seller } from '../infra/Entity';
import { contract } from '../interfaces/contract';
import path from 'path';
import { v4 as uuid } from 'uuid'
import { findEmail } from '../interfaces/findEmail';
import { contract as hashContract } from '../../../shared/providers/hash/contract';
import { AppError } from '../../../shared/AppError';

@injectable()
export class ConfirmEmail {
    constructor(
        @inject('Seller')
        private seller: contract,
        @inject('Hash')
        private hash: hashContract,
    ) {}

    async execute({
     token    
    }: findEmail): Promise<string> {

        const id = token

        const seller = await this.seller.findById(id);

        if (!seller) {
            throw new AppError('Username ou a senha invalidos', 401);
        }

        const tokenMatched = await this.hash.compareHash(
            token,
            seller.password,
        );

        if(!tokenMatched) {
            throw new AppError('Token invalido')
        }

        const goiaba = 'aa'

        return 'Email confirmado'
    }
}