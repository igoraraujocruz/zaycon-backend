import { instanceToPlain } from 'class-transformer';
import { Request, Response } from 'express';
import { container } from 'tsyringe';
import { Upload } from '../services/Upload';
import { Delete } from '../services/Delete';
import { GetAll } from '../services/GetAll';

export class Controller {
    async create(
        request: Request,
        response: Response,
    ): Promise<Response> {

        const name = request.file;
        
        const { productOrTagUrl } = request.params;

        const uploadPhotos = container.resolve(Upload);

        await uploadPhotos.execute({
            name: name?.filename,
            productOrTagUrl
        });

        return response.status(200).json({ message: 'Upload banner with success' });
    }

    async getAll(
        request: Request,
        response: Response,
    ): Promise<Response> {

        const getAll = container.resolve(GetAll);

        const banners = await getAll.execute();

        return response.status(200).json(instanceToPlain(banners));
    }

    async remove(
        request: Request,
        response: Response,
    ): Promise<Response> {
        const { id } = request.params;

        const removeBanner = container.resolve(Delete);

        const bannerRemoved = await removeBanner.execute(id);

        return response.status(200).json(bannerRemoved);
    }
}