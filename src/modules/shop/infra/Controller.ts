import { instanceToPlain } from 'class-transformer';
import { Request, Response } from 'express';
import { container } from 'tsyringe';
import { Create } from '../services/Create';
import { GetById } from '../services/GetById';
import { gerarPix } from '../services/gerarPix';
import { GetAll } from '../services/GetAll';
import { GetBySellerId } from '../services/GetBySellerId';
import { AppError } from '../../../shared/AppError';
import { SaveTxid } from '../services/SaveTxid';
import { ReceiveConfirmationPixAndSendEmails } from '../services/ReceiveConfirmationPixAndSendEmails';

export class Controller {
    async create(
        request: Request,
        response: Response,
    ): Promise<Response> {
        const { clientId, sellerId, typeOfPayment } =
            request.body;

        const create = container.resolve(Create);

        const item = await create.execute({
            clientId, sellerId, typeOfPayment
        });

        return response.status(200).json(item);
    }

    async get(request: Request, response: Response): Promise<Response> {
        const { sellerId, shopId } = request.query;

        if (sellerId) {
            const get = container.resolve(GetBySellerId);

            const product = await get.execute(String(sellerId));

            return response.json(instanceToPlain(product));
        }

        if (shopId) {
            const get = container.resolve(GetById);

            const shop = await get.execute(String(shopId));

            return response.json(instanceToPlain(shop));
        }

        const getAll = container.resolve(GetAll)

        const item = await getAll.execute()

        return response.status(200).json(instanceToPlain(item))
    }

    async generateCharge(
        request: Request,
        response: Response,
    ): Promise<Response> {

        const { shopId } = request.body;

        const getById = container.resolve(GetById);

        const items = await getById.execute(shopId)

        if(!items) {
            throw new AppError('ShopId não encontrado')
        }

        const prova = items.order.reduce((prev, curr) => {
            return prev + curr.product.price * curr.quantity
        }, 0)

        setTimeout(async () => {
            try {
                const getById = container.resolve(GetById);

                const shop = await getById.execute(shopId)

                if(!shop) {
                    throw new AppError('ShopId não encontrado')
                }
        
                const contraProva = shop.order.reduce((prev, curr) => {
                    return prev + curr.product.price * curr.quantity
                }, 0)

                if(prova != contraProva) {
                    throw new AppError('Valores divergentes')
                }

                const pix = await gerarPix(contraProva, shopId)

                const txid = pix.cobranca.data.txid

                const saveTxId = container.resolve(
                    SaveTxid,
                );

                await saveTxId.execute(txid, shop.id)
        
                return response.status(200).json(pix.qrcode.data);
                
            } catch(err) {
                console.log(err)
            }
          }, 1000)

          return response.status(200);
    }

    async receiveConfirmationPix(
        request: Request,
        response: Response,
    ): Promise<Response> {
        const { txid } = request.body.pix[0]

        const receiveConfirmationPixAndSendEmails = container.resolve(
            ReceiveConfirmationPixAndSendEmails,
        );

        await receiveConfirmationPixAndSendEmails.execute(txid);

        return response.send('200');
    }

}