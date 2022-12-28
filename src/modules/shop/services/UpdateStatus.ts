import { AppError } from '../../../shared/AppError';
import { inject, injectable } from 'tsyringe';
import { Shop } from '../infra/Entity';
import { contract } from '../interfaces/contract';
import { IMailProvider } from '../../../shared/providers/MailProvider/models/IMailProvider';
import path from 'path';
import axios from 'axios';

@injectable()
export class UpdateStatus {
    constructor(
        @inject('Shop')
        private repository: contract,
        @inject('MailProvider')
        private mailProvider: IMailProvider,
    ) {}

    async execute(shopId: string, status: string): Promise<Shop> {

        const shop = await this.repository.getById(shopId);

        const { data } = await axios.get(`${process.env.WHATSAPP_INSTANCE_URL}/instance/info?key=1`)

        const phoneConnected = data.instance_data.phone_connected

        if(!phoneConnected) {
            throw new AppError('É necessário instanciar o whatsapp antes')
        }


        if(!shop) {
            throw new AppError('Compra não localizada')
        }

         if(status === 'Preparando') {
                await axios.post(`${process.env.WHATSAPP_INSTANCE_URL}/message/text?key=${data.instance_data.instance_key}`, {
                id: `55${shop.client.numberPhone}`,
                message: `${shop.client.name}, já estamos preparando a sua compra e em poucos instantes ela será enviada...`
            }) 

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

            await axios.post(`${process.env.WHATSAPP_INSTANCE_URL}/message/text?key=${data.instance_data.instance_key}`, {
                id: `55${shop.client.numberPhone}`,
                message: `${shop.client.name}, sua compra está a caminho!`
            }) 

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

            await axios.post(`${process.env.WHATSAPP_INSTANCE_URL}/message/text?key=${data.instance_data.instance_key}`, {
                id: `55${shop.client.numberPhone}`,
                message: `Muito obrigado por comprar com a gente, ${shop.client.name}. Esperamos te ver novamente 😉`
            }) 

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

        return shop;
    }
}