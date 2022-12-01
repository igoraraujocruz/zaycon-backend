import { inject, injectable } from 'tsyringe';
import { Seller } from '../infra/Entity';
import { contract } from '../interfaces/contract';

@injectable()
export class GetMe {
    constructor(
        @inject('Seller')
        private repository: contract,
    ) {}

    async execute(id:string): Promise<Seller | undefined> {

        const item = await this.repository.findById(id);

        return item;
    }
}