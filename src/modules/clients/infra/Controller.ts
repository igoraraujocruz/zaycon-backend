
import { instanceToPlain } from 'class-transformer';
import { Request, Response } from 'express';
import { container } from 'tsyringe';
import { Create } from '../services/Create';
import { GetAll } from '../services/GetAll';
import { Client } from "@googlemaps/google-maps-services-js";

export class Controller {
    async create(
        request: Request,
        response: Response,
    ): Promise<Response> {
        const { name, cep, logradouro, bairro, localidade, uf, residenceNumber, email, numberPhone } =
            request.body;

        const numberPhoneFormated = numberPhone.replace('(', '').replace(')', '').replace(' ', '').replace('-', '')

        const create = container.resolve(Create);

        const item = await create.execute({
            name, cep, logradouro, bairro, localidade, uf, residenceNumber, email, numberPhone: numberPhoneFormated
        });

        return response.status(200).json(item);
    }

    async getAll(request: Request, response: Response): Promise<Response> {
        const getAll = container.resolve(GetAll)

        const item = await getAll.execute()

        return response.status(200).json(instanceToPlain(item))
    }

    async getAddress(request: Request, response: Response): Promise<Response> {

        const { address } =
            request.body;

        const client = new Client({});
        
        const getAddress = await client.distancematrix({
            params: {
                origins: [
                    `${process.env.ENDERECO_DA_LOJA}`
                ],
                destinations: [
                    `${address.logradouro}, ${address.residenceNumber} - ${address.bairro}, ${address.localidade} - ${address.uf}, ${address.cep}`
                ],
                key: `${process.env.GOOGLE_KEY}`
            }
        })

        const addressComplete = getAddress.data.rows[0].elements[0].distance.value

        const valueFrete = (addressComplete * Number(process.env.VALOR_FRETE_POR_METRO)).toFixed(2)

        return response.status(200).json(valueFrete)
    }
}