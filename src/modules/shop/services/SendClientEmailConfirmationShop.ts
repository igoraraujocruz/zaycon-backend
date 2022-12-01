import { injectable, inject } from 'tsyringe';
import path from 'path';
import { AppError } from '../../../shared/AppError';
import { IMailProvider } from '../../../shared/providers/MailProvider/models/IMailProvider';

interface IRequest {
    email: string;
}

@injectable()
export class SendClientEmailConfirmationShop {
    constructor(
        @inject('MailProvider')
        private mailProvider: IMailProvider,
    ) {}

    async execute({ email }: IRequest): Promise<void> {

        const confirmationShopTemplate = path.resolve(
            __dirname,
            '..',
            'views',
            'confirmationClientShop.hbs',
        );

        await this.mailProvider.sendMail({
            to: {
                name: 'user.name',
                email: email,
            },
            from: {
                name: `${process.env.NAME_TITLE_EMAIL}`,
                email: `${process.env.EMAIL_CONFIG_AWS}`,
            },
            subject: '[Zaycon] Comprovante',
            templateData: {
                file: confirmationShopTemplate,
                variables: {
                    name: 'user.name',
                    link: 'link',
                },
            },
        });
    }
}