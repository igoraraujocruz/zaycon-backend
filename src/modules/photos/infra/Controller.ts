import { Request, Response } from 'express';
import { container } from 'tsyringe';
import { Upload } from '../services/Upload';
import { Delete } from '../services/Delete';

export class Controller {
    async create(
        request: Request,
        response: Response,
    ): Promise<Response> {
        const { productId } = request.params;

        const uploadPhotos = container.resolve(Upload);

        request.files.forEach(nome => {
            uploadPhotos.execute({
                name: nome.filename,
                productId,
            });
        });

        return response.status(200).json({ message: 'Upload image success' });
    }

    async remove(
        request: Request,
        response: Response,
    ): Promise<Response> {
        const { id } = request.params;

        const removePhoto = container.resolve(Delete);

        const photoRemoved = await removePhoto.execute(id);

        return response.status(200).json(photoRemoved);
    }
}