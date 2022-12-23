import { IMailProvider } from '../../../shared/providers/MailProvider/models/IMailProvider';
import { inject, injectable } from 'tsyringe';
import { Shop } from '../infra/Entity';
import { contract } from '../interfaces/contract';
import { contract as sellerContract } from '../../sellers/interfaces/contract';
import { contract as productContract } from '../../products/interfaces/contract';
import path from 'path';
import { AppError } from '../../../shared/AppError';
import { io } from '../../../shared/http';

@injectable()
export class ReceiveConfirmationPixAndSendEmails {
    constructor(
        @inject('Shop')
        private repository: contract,
        @inject('Product')
        private product: productContract,
        @inject('MailProvider')
        private mailProvider: IMailProvider,
        @inject('Seller')
        private seller: sellerContract,
    ) {}

    async execute(txid: string): Promise<Shop | undefined> {

        const item = await this.repository.getByReferenceId(txid);

        if (!item) {
            throw new AppError('Shop not found')
        }

        item.paid = true

        item.order.map(async (oldOrder) => {
            const product = await this.product.findById(oldOrder.productId)

            if(product) {
                 product.amount -= oldOrder.quantity
                 await this.product.save(product)
            }

        })

        await this.repository.save(item)


        const points = item.order.reduce((prev, curr) => {
            return prev + curr.product.points * curr.quantity
        }, 0)

        try {
            const seller = await this.seller.findById(item.sellerId)

            if (!seller) {
                throw new AppError('Vendedor não encontrado')
            }

            seller.points += points
        
            await this.seller.save(seller)

            const confirmationSellerShopTemplate = path.resolve(
                __dirname,
                '..',
                'views',
                'confirmationSellerShop.hbs',
            );
    
    
            await this.mailProvider.sendMail({
                from: {
                    name: `${process.env.NAME_EMAIL}`,
                    email: `${process.env.AWS_SES_EMAIL}`,
                },
                to: {
                    name: seller.name,
                    email: seller.email,
                },
                subject: `[Zaycon] ${item.client.name} acabou de comprar e você acabou de ganhar!!!`,
                templateData: {
                    file: confirmationSellerShopTemplate,
                    variables: {
                        nameSeller: seller.name,
                        nameClient: item.client.name
                    },
                },
            }); 
    
            
        } catch(err) {
            //no-error
        }

        

        io.to(item.socketId).emit("receivePaiment", {name: item.client.name}) 

        io.emit("receivePaimentAdmin") 

        const confirmationAdminShopTemplate = path.resolve(
            __dirname,
            '..',
            'views',
            'confirmationAdminShop.hbs',
        );

        await this.mailProvider.sendMail({
            from: {
                name: `${process.env.NAME_EMAIL}`,
                email: `${process.env.AWS_SES_EMAIL}`,
            },
            to: {
                name: `${process.env.NAME_EMAIL}`,
                email: `${process.env.AWS_SES_EMAIL}`,
            },
            subject: `[Zaycon] Compra realizada por ${item.client.name}`,
            templateData: {
                file: confirmationAdminShopTemplate,
                variables: {
                    nameClient: item.client.name,
                    addressClient: item.client.address,
                    cepClient: item.client.cep,
                    emailClient: item.client.email,
                    numberPhoneClient: item.client.numberPhone
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
            from: {
                name: `${process.env.NAME_EMAIL}`,
                email: `${process.env.AWS_SES_EMAIL}`,
            },
            to: {
                name: item.client.name,
                email: item.client.email,
            },
            subject: '[Zaycon] Recebemos o seu pagamento!',
            templateData: {
                file: confirmationClientShopTemplate,
                variables: {
                    name: item.client.name,
                    orders: item.order.map(order => {
                        return (
                            order.quantity, order.product.name
                    )}),
                },
            },
        });

        return item;
        
    }
}