import { inject, injectable } from 'tsyringe';
import { Shop } from '../infra/Entity';
import { contract } from '../interfaces/contract';
import { create } from '../interfaces/create';
import { io } from '../../../shared/http';

@injectable()
export class Create {
    constructor(
        @inject('Shop')
        private repository: contract,
    ) {}

    async execute({
        clientId, sellerId, typeOfPayment, socketId, status
    }: create): Promise<Shop> {

        const item = await this.repository.create({
            clientId, sellerId, typeOfPayment, socketId, status
        });

        io.emit("createShop") 

        return item;
    }
}