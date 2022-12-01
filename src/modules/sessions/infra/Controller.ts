import { Request, Response } from 'express';
import { Authentication } from '../services/Authentication';
import { Refresh } from '../services/Refresh';
import { container } from 'tsyringe';
import { instanceToPlain } from 'class-transformer';

export class Controller {
    async create(
        request: Request,
        response: Response,
    ): Promise<Response> {
        const { username, password } = request.body;

        const create = container.resolve(Authentication);

        const { seller, token, refreshToken } = await create.execute({
            username,
            password,
        });

        return response.json({ user: instanceToPlain(seller), token, refreshToken });
    }

    async refresh(request: Request, response: Response): Promise<Response> {
        const newRefreshToken =
            request.body.refreshToken ||
            request.headers['x-access-token'] ||
            request.query.refreshToken;

        const refresh = container.resolve(Refresh);
        const token = await refresh.execute(newRefreshToken);

        return response.json(token);
    }
}