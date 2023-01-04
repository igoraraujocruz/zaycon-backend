import { instanceToPlain } from 'class-transformer';
import { Request, Response } from 'express';
import { container } from 'tsyringe';
import { Create } from '../services/Create';
import { GetAll } from '../services/GetAll';


export class Controller {
    async create(
        request: Request,
        response: Response,
    ): Promise<Response> {
        const { name, cep, address, email, numberPhone } =
            request.body;

            const numberPhoneFormated = numberPhone.replace('(', '').replace(')', '').replace(' ', '').replace('-', '')

        const create = container.resolve(Create);

        const item = await create.execute({
            name, cep, address, email, numberPhone: numberPhoneFormated
        });

        return response.status(200).json(item);
    }

    async getAll(request: Request, response: Response): Promise<Response> {
        const getAll = container.resolve(GetAll)

        const item = await getAll.execute()

        return response.status(200).json(instanceToPlain(item))
    }
}