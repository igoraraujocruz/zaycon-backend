import { AppError } from '../../../shared/AppError';
import { inject, injectable } from 'tsyringe';
import { Shop } from '../infra/Entity';
import { contract } from '../interfaces/contract';
import { IMailProvider } from '../../../shared/providers/MailProvider/models/IMailProvider';
import path from 'path';
import { io } from '../../../shared/http';

@injectable()
export class UpdateStatus {
    constructor(
        @inject('Shop')
        private repository: contract,
        @inject('MailProvider')
        private mailProvider: IMailProvider,
    ) {}

    async execute(shopId: string, status: string): Promise<Shop> {

        console.log('chegou aqui')

        const shop = await this.repository.getById(shopId);

        console.log(shop)

        if(!shop) {
            throw new AppError('Compra não localizada')
        }

         if(status === 'Preparando') {
            const prepareShopEmailTemplate = path.resolve(
                __dirname,
                '..',
                'views',
                'prepareShopEmailTemplate.hbs',
            );
    
            await this.mailProvider.sendMail({
                to: {
                    name: shop.client.name,
                    email: shop.client.email,
                },
                from: {
                    name: `${process.env.NAME_EMAIL}`,
                    email: `${process.env.AWS_SES_EMAIL}`,
                },
                subject: '[Zaycon] Estamos preparando a sua compra 📦',
                templateData: {
                    file: prepareShopEmailTemplate,
                    variables: {
                        name: shop.client.name,
                    },
                },
            });
        } 

        if(status === 'Enviado') {
            const sendShopEmailTemplate = path.resolve(
                __dirname,
                '..',
                'views',
                'sendShopEmailTemplate.hbs',
            );
    
            await this.mailProvider.sendMail({
                to: {
                    name: shop.client.name,
                    email: shop.client.email,
                },
                from: {
                    name: `${process.env.NAME_EMAIL}`,
                    email: `${process.env.AWS_SES_EMAIL}`,
                },
                subject: '[Zaycon] Sua compra está chegando 🚚',
                templateData: {
                    file: sendShopEmailTemplate,
                    variables: {
                        name: shop.client.name,
                    },
                },
            });
        } 

        if(status === 'Entregue') {
            
            const finishShopEmailTemplate = path.resolve(
                __dirname,
                '..',
                'views',
                'finishShopEmailTemplate.hbs',
            );
    
            await this.mailProvider.sendMail({
                to: {
                    name: shop.client.name,
                    email: shop.client.email,
                },
                from: {
                    name: `${process.env.NAME_EMAIL}`,
                    email: `${process.env.AWS_SES_EMAIL}`,
                },
                subject: '[Zaycon] Sua compra foi entregue 🎆',
                templateData: {
                    file: finishShopEmailTemplate,
                    variables: {
                        name: shop.client.name,
                    },
                },
            });
        }

        shop.status = status

        await this.repository.save(shop)

        io.emit("changeStatus", {shopId: shop.id}) 

        return shop;
    }
}