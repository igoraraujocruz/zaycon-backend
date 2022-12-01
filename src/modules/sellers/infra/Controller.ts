import { Request, Response } from 'express';
import { container } from 'tsyringe';
import { Create } from '../services/Create';
import { instanceToPlain } from 'class-transformer';
import { GetMe } from '../services/GetMe';
import { GetAll } from '../services/GetAll';

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

    async getAll(request: Request, response: Response): Promise<Response> {

        const getMe = container.resolve(GetAll)

        const sellers = await getMe.execute();

        return response.status(200).json(instanceToPlain(sellers)); 
    }

    async getMe(request: Request, response: Response): Promise<Response> {
        const { id } = request.user;

        const getMe = container.resolve(GetMe)

        const seller = await getMe.execute(id);

        return response.status(200).json(instanceToPlain(seller)); 
    }
}