import { Request, Response } from 'express';
import { container } from 'tsyringe';
import { Create } from '../services/Create';
import { instanceToPlain } from 'class-transformer';
import { GetAll } from '../services/GetAll';
import { GetBySellerName } from '../services/GetBySellerName';
import { Update } from '../services/Update';

export class Controller {
    async create(
        request: Request,
        response: Response,
    ): Promise<Response> {
        const { productId } =
            request.body;

            const { id } =
            request.user;

        const create = container.resolve(Create);

        const item = await create.execute({
            productId, sellerId: id
        });

        return response.status(200).json(instanceToPlain(item));
    }

    async update(
        request: Request,
        response: Response,
    ): Promise<Response> {
        const { sellerOrderId } =
            request.params;

        const update = container.resolve(Update);
        
        const item = await update.execute(sellerOrderId);

        return response.status(200).json(instanceToPlain(item));
    }
}