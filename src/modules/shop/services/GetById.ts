import { inject, injectable } from 'tsyringe';
import { contract } from '../interfaces/contract';
import { Shop } from '../infra/Entity';

@injectable()
export class GetById {
    constructor(
        @inject('Shop')
        private repository: contract,
    ) {}

    async execute(id: string): Promise<Shop | undefined> {
        const item = await this.repository.getById(id);

        return item;
    }
}