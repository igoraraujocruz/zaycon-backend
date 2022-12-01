import { inject, injectable } from 'tsyringe';
import { Seller } from '../infra/Entity';
import { contract } from '../interfaces/contract';

@injectable()
export class GetAll {
    constructor(
        @inject('Seller')
        private repository: contract,
    ) {}

    async execute(): Promise<Seller[]> {

        const item = await this.repository.getAll();

        return item;
    }
}