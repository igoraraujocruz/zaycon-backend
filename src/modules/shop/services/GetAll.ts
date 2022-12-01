import { inject, injectable } from 'tsyringe';
import { Shop } from '../infra/Entity';
import { contract } from '../interfaces/contract';

@injectable()
export class GetAll {
    constructor(
        @inject('Shop')
        private repository: contract,
    ) {}

    async execute(): Promise<Shop[]> {

        const item = await this.repository.getAll();

        return item;
    }
}