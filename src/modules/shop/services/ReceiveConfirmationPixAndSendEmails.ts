import { IMailProvider } from '../../../shared/providers/MailProvider/models/IMailProvider';
import { inject, injectable } from 'tsyringe';
import { Shop } from '../infra/Entity';
import { contract } from '../interfaces/contract';
import path from 'path';
import { AppError } from '../../../shared/AppError';
import { io } from '../../../shared/http';

@injectable()
export class ReceiveConfirmationPixAndSendEmails {
    constructor(
        @inject('Shop')
        private repository: contract,
        @inject('MailProvider')
        private mailProvider: IMailProvider,
    ) {}

    async execute(txid: string): Promise<Shop | undefined> {

        const item = await this.repository.getByReferenceId(txid);

        if (!item) {
            throw new AppError('Shop not found')
        }

        item.paid = true

        await this.repository.save(item)

        io.to(item.socketId).emit("receivePaiment", {name: item.client.name}) 

        const confirmationAdminShopTemplate = path.resolve(
            __dirname,
            '..',
            'views',
            'confirmationAdminShop.hbs',
        );

        await this.mailProvider.sendMail({
            to: {
                name: `${process.env.NAME_EMAIL}`,
                email: `${process.env.AWS_SES_EMAIL}`,
            },
            from: {
                name: `${process.env.NAME_EMAIL}`,
                email: `${process.env.AWS_SES_EMAIL}`,
            },
            subject: '[Zaycon] Comprovante',
            templateData: {
                file: confirmationAdminShopTemplate,
                variables: {
                    name: 'user.name',
                    link: 'link',
                },
            },
        });

        const confirmationClientShopTemplate = path.resolve(
            __dirname,
            '..',
            'views',
            'confirmationClientShop.hbs',
        );


        await this.mailProvider.sendMail({
            to: {
                name: 'user.name',
                email: item.client.email,
            },
            from: {
                name: `${process.env.NAME_EMAIL}`,
                email: `${process.env.AWS_SES_EMAIL}`,
            },
            subject: '[Zaycon] Comprovante',
            templateData: {
                file: confirmationClientShopTemplate,
                variables: {
                    name: 'user.name',
                    link: 'link',
                },
            },
        });

        return item;
        
    }
}