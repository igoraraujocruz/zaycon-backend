import { inject, injectable } from 'tsyringe';
import { Client } from '../infra/Entity';
import { contract } from '../interfaces/contract';

@injectable()
export class GetAll {
    constructor(
        @inject('Client')
        private repository: contract,
    ) {}

    async execute(): Promise<Client[]> {

        const item = await this.repository.getAll();

        return item;
    }
}