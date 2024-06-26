import { instanceToPlain } from 'class-transformer';
import { Request, Response } from 'express';
import { container } from 'tsyringe';
import { Create } from '../services/Create';
import { GetById } from '../services/GetById';
import { gerarPix } from '../services/gerarPix';
import { GetAll } from '../services/GetAll';
import { GetBySellerId } from '../services/GetBySellerId';
import { AppError } from '../../../shared/AppError';
import { SaveReferenceId } from '../services/SaveReferenceId';
import { ReceiveConfirmationPixAndSendEmails } from '../services/ReceiveConfirmationPixAndSendEmails';
import { UpdateStatus } from '../services/UpdateStatus';

export class Controller {
    async create(
        request: Request,
        response: Response,
    ): Promise<Response> {
                
        const { clientId, sellerId, typeOfPayment, socketId } =
            request.body;

        const create = container.resolve(Create);

        const item = await create.execute({
            clientId, sellerId, typeOfPayment, socketId,
            status: 'Aguardando Confirmação'
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

    async generateGerencianetCharge(
        request: Request,
        response: Response,
    ): Promise<Response> {

        const { shopId } = request.body;

        const getById = container.resolve(GetById);

        const items = await getById.execute(shopId)

        if(!items) {
            throw new AppError('ShopId não encontrado')
        }

        setTimeout(async () => {
            try {
                const getById = container.resolve(GetById);

                const shop = await getById.execute(shopId)

                if(!shop) {
                    throw new AppError('ShopId não encontrado')
                }

                if(shop.client.cep === null) {
                    const valueOfAllProducts = shop.order.reduce((prev, curr) => {
                        return prev + curr.product.price * curr.quantity
                    }, 0)
    
                    let taxeGerencianet = Number((valueOfAllProducts * 1.19/100).toFixed(3)) 
                    
                    const taxeToString = taxeGerencianet.toString()
                    
                    const lastNum = parseInt(taxeToString[taxeToString.length -1])
    
                    if(lastNum == 5) {
                        taxeGerencianet += 0.01
                    }
    
                    const totalPriceContraProva = valueOfAllProducts + taxeGerencianet
    
                    const pix = await gerarPix(totalPriceContraProva, shopId)
    
                    const txid = pix.cobranca.data.txid
    
                    const saveReferenceId = container.resolve(
                        SaveReferenceId,
                    );
    
                    await saveReferenceId.execute(txid, shop.id)
            
                    return response.status(200).json(pix.qrcode.data);
                    
                } else {
                    const valueOfAllProducts = shop.order.reduce((prev, curr) => {
                        return prev + curr.product.price * curr.quantity
                    }, 0)

                   if (shop.client.localidade === 'Vitória') {
                    const sumValueOfAllProductsAndValueFrete = valueOfAllProducts + 15;

                    let taxeGerencianet = Number((sumValueOfAllProductsAndValueFrete * 1.19/100).toFixed(3))

                    const taxeToString = taxeGerencianet.toString()
                
                    const lastNum = parseInt(taxeToString[taxeToString.length -1])
    
                    if(lastNum == 5) {
                        taxeGerencianet += 0.01
                    }

                    const totalPriceContraProva = sumValueOfAllProductsAndValueFrete + taxeGerencianet

                    const pix = await gerarPix(totalPriceContraProva, shopId)

                    const txid = pix.cobranca.data.txid

                    const saveReferenceId = container.resolve(
                        SaveReferenceId,
                    );

                    await saveReferenceId.execute(txid, shop.id)
        
                    return response.status(200).json(pix.qrcode.data);
                   }

                   if (shop.client.localidade === 'Vila Velha') {
                    const sumValueOfAllProductsAndValueFrete = valueOfAllProducts + 20;

                    let taxeGerencianet = Number((sumValueOfAllProductsAndValueFrete * 1.19/100).toFixed(3))

                    const taxeToString = taxeGerencianet.toString()
                
                    const lastNum = parseInt(taxeToString[taxeToString.length -1])
    
                    if(lastNum == 5) {
                        taxeGerencianet += 0.01
                    }

                    const totalPriceContraProva = sumValueOfAllProductsAndValueFrete + taxeGerencianet

                    const pix = await gerarPix(totalPriceContraProva, shopId)

                    const txid = pix.cobranca.data.txid

                    const saveReferenceId = container.resolve(
                        SaveReferenceId,
                    );

                    await saveReferenceId.execute(txid, shop.id)
        
                    return response.status(200).json(pix.qrcode.data);
                   }

                   if (shop.client.localidade === 'Cariacica' || shop.client.localidade === 'Serra') {
                    const sumValueOfAllProductsAndValueFrete = valueOfAllProducts + 30;

                    let taxeGerencianet = Number((sumValueOfAllProductsAndValueFrete * 1.19/100).toFixed(3))

                    const taxeToString = taxeGerencianet.toString()
                
                    const lastNum = parseInt(taxeToString[taxeToString.length -1])
    
                    if(lastNum == 5) {
                        taxeGerencianet += 0.01
                    }

                    const totalPriceContraProva = sumValueOfAllProductsAndValueFrete + taxeGerencianet

                    const pix = await gerarPix(totalPriceContraProva, shopId)

                    const txid = pix.cobranca.data.txid

                    const saveReferenceId = container.resolve(
                        SaveReferenceId,
                    );

                    await saveReferenceId.execute(txid, shop.id)
        
                    return response.status(200).json(pix.qrcode.data);
                   }
                }

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

        console.log('controller')

        const receiveConfirmationPixAndSendEmails = container.resolve(
            ReceiveConfirmationPixAndSendEmails,
        );

        await receiveConfirmationPixAndSendEmails.execute(txid);

        return response.send('200');
    }

    async updateStatus(
        request: Request,
        response: Response,
    ): Promise<Response> {
        const { shopId, status } = request.body

        const updateStatus = container.resolve(
            UpdateStatus,
        );

        const shop = await updateStatus.execute(shopId, status);

        return response.status(200).json(shop);
    }

}