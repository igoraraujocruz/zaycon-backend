import { inject, injectable } from 'tsyringe';
import { Client } from '../infra/Entity';
import { contract } from '../interfaces/contract';
import { create } from '../interfaces/create';

@injectable()
export class Create {
    constructor(
        @inject('Client')
        private repository: contract,
    ) {}

    async execute({
        name, cep, logradouro, bairro, localidade, uf, residenceNumber, email, numberPhone    
    }: create): Promise<Client> {

        const item = await this.repository.create({
            name, cep, logradouro, bairro, localidade, uf, residenceNumber, email, numberPhone
        });

        return item;
    }
}