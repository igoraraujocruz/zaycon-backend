import { inject, injectable } from 'tsyringe';
import { Seller } from '../infra/Entity';
import { contract } from '../interfaces/contract';
import { create } from '../interfaces/create';
import { hash } from 'bcryptjs';
import { AppError } from '../../../shared/AppError';

@injectable()
export class Create {
    constructor(
        @inject('Seller')
        private repository: contract,
    ) {}

    async execute({
        name, username, password, email, numberPhone, birthday    
    }: create): Promise<Seller> {

        const findSameUsername = await this.repository.getBySellerUsername(username)

        if(findSameUsername) {
            throw new AppError('Este nome de usuário já existe, tente outro...')
        }

        const findSameEmail = await this.repository.getByEmail(email)

        if(findSameEmail) {
            throw new AppError('Este email já está registrado, tente outro...')
        }

        const findSameNumberPhone = await this.repository.getByNumberPhone(numberPhone)

        if(findSameNumberPhone) {
            throw new AppError('Este celular já está registrado, tente outro...')
        }

        const hashedPassword = await hash(password, 8);

        const item = await this.repository.create({
            name, username, password: hashedPassword, email, numberPhone, birthday
        });

        return item;
    }
}