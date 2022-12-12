import { Request, Response } from 'express';
import { container } from 'tsyringe';
import { Create } from '../services/Create';
import { instanceToPlain } from 'class-transformer';
import { GetMe } from '../services/GetMe';
import { GetAll } from '../services/GetAll';
import { GetBySellerName } from '../services/GetBySellerName';
import { GetBySellerUsername } from '../services/GetBySellerUsername';
import { ConfirmEmail } from '../services/ConfirmEmail';
import { ReceiveConfirmationEmail } from '../services/ReceiveConfirmationEmail';
import { SendForgotPasswordEmailService } from '../services/SendForgotPasswordEmail';
import { ResetPassword } from '../services/ResetPassword';

export class Controller {
    async create(
        request: Request,
        response: Response,
    ): Promise<Response> {
        const { name, username, password, email, numberPhone, birthday } =
            request.body;

            const numberPhoneFormated = numberPhone.replace('(', '').replace(')', '').replace(' ', '').replace('-', '')

        const create = container.resolve(Create);

        const item = await create.execute({
            name, username, password, email, numberPhone: numberPhoneFormated, birthday
        });

        const confirmEmail = container.resolve(ConfirmEmail)

        await confirmEmail.execute(item)

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

    async confirmEmail(
        request: Request,
        response: Response,
    ): Promise<Response> {
        const { token } = request.params;

        const confirmationEmail = container.resolve(ReceiveConfirmationEmail);

        await confirmationEmail.execute(token);

        return response.status(204).json();
    }

    async forgotPassword(
        request: Request,
        response: Response,
    ): Promise<Response> {
        const { email } = request.body;

        const sendForgotPasswordEmail = container.resolve(
            SendForgotPasswordEmailService,
        );

        await sendForgotPasswordEmail.execute({ email });

        return response.status(204).json();
    }

    async resetPassword(
        request: Request,
        response: Response,
    ): Promise<Response> {

        const { token } = request.params;
        const { password } = request.body;

        const resetPassword = container.resolve(ResetPassword);

        await resetPassword.execute({ token, password });

        return response.status(204).json();
    }
}