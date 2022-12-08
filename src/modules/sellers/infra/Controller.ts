import { Request, Response } from 'express';
import { container } from 'tsyringe';
import { Create } from '../services/Create';
import { instanceToPlain } from 'class-transformer';
import { GetMe } from '../services/GetMe';
import { GetAll } from '../services/GetAll';
import { GetBySellerName } from '../services/GetBySellerName';
import { GetBySellerUsername } from '../services/GetBySellerUsername';

export class Controller {
    async create(
        request: Request,
        response: Response,
    ): Promise<Response> {
        const { name, username, password, email, numberPhone, birthday } =
            request.body;

        const create = container.resolve(Create);

        const item = await create.execute({
            name, username, password, email, numberPhone, birthday
        });

        return response.status(200).json(instanceToPlain(item));
    }

    async get(request: Request, response: Response): Promise<Response> {

        const { sellerName, sellerUsername } = request.query;

        if (sellerName) {
            const get = container.resolve(GetBySellerName);

            const seller = await get.execute(String(sellerName));

            return response.json(instanceToPlain(seller));
        }

        if (sellerUsername) {
            const get = container.resolve(GetBySellerUsername);

            const seller = await get.execute(String(sellerUsername));

            return response.json(instanceToPlain(seller));
        }

        const getAll = container.resolve(GetAll)

        const sellers = await getAll.execute();

        return response.status(200).json(instanceToPlain(sellers)); 
    }

    async getMe(request: Request, response: Response): Promise<Response> {
        const { id } = request.user;

        const getMe = container.resolve(GetMe)

        const seller = await getMe.execute(id);

        return response.status(200).json(instanceToPlain(seller)); 
    }
}