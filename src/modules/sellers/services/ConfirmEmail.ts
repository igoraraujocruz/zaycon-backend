import { inject, injectable } from 'tsyringe';
import path from 'path';
import { v4 as uuid } from 'uuid'
import { IMailProvider } from '../../../shared/providers/MailProvider/models/IMailProvider';
import { Seller } from '../infra/Entity';
import { contract as tokenContract } from '../../sessions/interfaces/contract'

@injectable()
export class ConfirmEmail {
    constructor(
        @inject('MailProvider')
        private mailProvider: IMailProvider,
        @inject('Token')
        private token: tokenContract,
    ) {}

    async execute(seller: Seller): Promise<void> {

        const confirmationEmailTemplate = path.resolve(
            __dirname,
            '..',
            'views',
            'confirmEmail.hbs',
        );

        const token = uuid();

        await this.token.create({
            refreshToken: token,
            sellerId: seller.id,
        })

        await this.mailProvider.sendMail({
            to: {
                name: seller.name,
                email: seller.email,
            },
            from: {
                name: `${process.env.NAME_EMAIL}`,
                email: `${process.env.AWS_SES_EMAIL}`,
            },
            subject: '[Zaycon] Confirmação de Email',
            templateData: {
                file: confirmationEmailTemplate,
                variables: {
                    name: seller.name,
                    link: `${process.env.WEB_HOST}/emailConfirmation?token=${token}`,
                },
            },
        });
    }
}