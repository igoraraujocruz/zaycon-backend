import { inject, injectable } from 'tsyringe';
import { Seller } from '../infra/Entity';
import { contract } from '../interfaces/contract';
import { create } from '../interfaces/create';
import { hash } from 'bcryptjs';

@injectable()
export class Create {
    constructor(
        @inject('Seller')
        private repository: contract,
    ) {}

    async execute({
        name, username, password, email, numberPhone, birthday    
    }: create): Promise<Seller> {

        const hashedPassword = await hash(password, 8);

        const item = await this.repository.create({
            name, username, password: hashedPassword, email, numberPhone, birthday
        });

        return item;
    }
}