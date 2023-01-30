import { inject, injectable } from 'tsyringe';
import { SellerOrders } from '../infra/Entity';
import { contract } from '../interfaces/contract';
import { AppError } from '../../../shared/AppError';

@injectable()
export class Update {
    constructor(
        @inject('SellerOrders')
        private repository: contract,
    ) {}

    async execute(sellerOrderId:string): Promise<SellerOrders> {

        const sellerOrder = await this.repository.getById(sellerOrderId)

        if (!sellerOrder) {
            throw new AppError('Pedido não encontrado')
        }

        if(sellerOrder.answered) {
            throw new AppError('Este pedido já foi atendido')
        } else {
            
            sellerOrder.answered = true

            await this.repository.save(sellerOrder)

            return sellerOrder;
        }
        
    }
}