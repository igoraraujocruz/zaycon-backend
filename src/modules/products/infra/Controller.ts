import { instanceToPlain } from 'class-transformer';
import { Request, Response } from 'express';
import { container } from 'tsyringe';
import { Create } from '../services/Create';
import { GetAll } from '../services/GetAll';
import slugify from 'slugify';
import { GetBySlug } from '../services/GetBySlug';
import { GetById } from '../services/GetById';
import { GetAllByName } from '../services/GetAllByName';
import { Upload } from '../../photos/services/Upload'

export class Controller {
    async create(
        request: Request,
        response: Response,
    ): Promise<Response> {

        const { name, description, amount, price, points } = request.body;

        const create = container.resolve(Create);
        const uploadPhotos = container.resolve(Upload);

        const product = await create.execute({
            name, description, amount, price, points,
            slug: slugify(name, {
                lower: true,
            }), 
        });

        request.files.forEach(nome => {
            uploadPhotos.execute({
                name: nome.filename,
                productId: product.id,
            });
        });

        return response.status(200).json(product);
    }

    async get(request: Request, response: Response): Promise<Response> {

        const { option, productSlug, productId, page, perPage } = request.query;

        if (productSlug) {
            const get = container.resolve(GetBySlug);

            const product = await get.execute(String(productSlug));

            return response.json(instanceToPlain(product));
        }

        if (productId) {
            const get = container.resolve(GetById);

            const product = await get.execute(String(productId));

            return response.json(instanceToPlain(product));
        }

        if (option) {
            const get = container.resolve(GetAllByName);

            const product = await get.execute(String(option));

            return response.json(instanceToPlain(product));
        }

        const getAll = container.resolve(GetAll)

        const item = await getAll.execute()

        return response.status(200).json(instanceToPlain(item))
    }
}