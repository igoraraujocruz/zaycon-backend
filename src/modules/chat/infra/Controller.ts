import { Request, Response } from 'express';
import Account from '../../../schemas/Chat'
import Messages from '../../../schemas/Messages'


export class Controller {
    async getChat(request: Request, response: Response): Promise<Response> {
        const account = await Account.find()

        return response.json(account)
    }

    async createAccount(request: Request, response: Response): Promise<Response> {
        const { name, plataform, numberPhone, message } = request.body;

        const numberPhoneFormated = numberPhone.replace('(', '').replace(')', '').replace(' ', '').replace('-', '')

        const findAccount = await Account.findOne({
            numberPhone: numberPhoneFormated
        })

        if (!findAccount) {
            const account = await Account.create({
                name,
                numberPhone:numberPhoneFormated,
                plataform,
            })

            await Messages.create({
                accountId: account._id,
                message
            })
    
        }

        const chat = await Messages.create({
            accountId: findAccount?._id,
            message
        })

        return response.json(chat)
    }

    async getChatByAccount(request: Request, response: Response): Promise<Response> {

        const { account } = request.query;

        const messages = await Messages.find({
            accountId: account
        })

        return response.json(messages)
    }
}