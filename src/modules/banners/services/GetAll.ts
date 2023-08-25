import { inject, injectable } from 'tsyringe';
import { Banner } from '../infra/Entity';
import { contract } from '../interfaces/contract';

@injectable()
export class GetAll {
    constructor(
        @inject('Banner')
        private repository: contract,
    ) {}

    async execute(): Promise<Banner[]> {

        const item = await this.repository.getAll();

        return item;
    }
}