import { injectable, inject } from 'tsyringe';
import path from 'path';
import { AppError } from '../../../shared/AppError';
import { contract as SellerContract } from '../../sellers/interfaces/contract';
import { IMailProvider } from '../../../shared/providers/MailProvider/models/IMailProvider';
import { contract as TokenContract } from '../../sessions/interfaces/contract';
import { v4 as uuid } from 'uuid';

interface IRequest {
    email: string;
}

@injectable()
export class SendForgotPasswordEmailService {
    constructor(
        @inject('Seller')
        private seller: SellerContract,

        @inject('MailProvider')
        private mailProvider: IMailProvider,

        @inject('Token')
        private token: TokenContract,
    ) {}

    async execute({ email }: IRequest): Promise<void> {
        const seller = await this.seller.getByEmail(email);

        const forgotPasswordTemplate = path.resolve(
            __dirname,
            '..',
            'views',
            'forgotPassword.hbs',
        );

        if (!seller) {
            throw new AppError('User does not exists');
        }

        const token = uuid();

        const date = new Date();

        date.setHours(date.getHours() + 2);

        const expiresDate = date;

        await this.token.create({
            refreshToken: token,
            sellerId: seller.id,
            expiresDate,
        });

        await this.mailProvider.sendMail({
            to: {
                name: seller.name,
                email: seller.email,
            },
            from: {
                name: `${process.env.NAME_EMAIL}`,
                email: `${process.env.AWS_SES_EMAIL}`,
            },
            subject: '[Zaycon] Recuperação de senha',
            templateData: {
                file: forgotPasswordTemplate,
                variables: {
                    name: seller.name,
                    link: `${process.env.WEB_HOST}/resetPassword?token=${token}`,
                },
            },
        });
    }
}