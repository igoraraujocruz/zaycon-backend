import { instanceToPlain } from 'class-transformer';
import { Request, Response } from 'express';
import { container } from 'tsyringe';
import { Create } from '../services/Create';
import { GetAll } from '../services/GetAll';
import { GetBySellerId } from '../services/GetBySellerId';

export class Controller {
    async create(
        request: Request,
        response: Response,
    ): Promise<Response> {
        const { productId, quantity, shopId } =
            request.body;

        const create = container.resolve(Create);

        const item = await create.execute({
            productId, quantity, shopId });

        return response.status(200).json(item);
    }

    async getAll(request: Request, response: Response): Promise<Response> {
        const { sellerId } = request.query;

        if (sellerId) {
            const get = container.resolve(GetBySellerId);

            const product = await get.execute(String(sellerId));

            return response.json(instanceToPlain(product));
        }

        const getAll = container.resolve(GetAll)

        const item = await getAll.execute()

        return response.status(200).json(instanceToPlain(item))
    }
}