import axios from 'axios';
import { Request, Response } from 'express';
import Account from '../../../schemas/Chat'
import Messages from '../../../schemas/Messages'
import { io } from '../../../shared/http';


export class Controller {
    async getChat(request: Request, response: Response): Promise<Response> {
        const account = await Account.find()

        return response.json(account)
    }

    async teste(request: Request, response: Response): Promise<Response> {

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

    async createAccount(request: Request, response: Response): Promise<Response> {

        const { numberPhone } = request.body;

        if(numberPhone) {

            const findAccount = await Account.findOne({
                numberPhone
            })

            if(findAccount) {
                await Messages.create({
                    accountId:findAccount._id,
                    message: request.body.message,
                    isClient: false,
                })

                axios({
                    method: "POST",
                    url:
                        "https://graph.facebook.com/v15.0/" +
                        114324004871873 +
                        "/messages?access_token=" +
                        process.env.WHATSAPP_TOKEN,
                    data: {
                        messaging_product: "whatsapp",
                        to: findAccount.numberPhone,
                        text: { body: request.body.message },
                    },
                    headers: { "Content-Type": "application/json" },
                });

                io.emit("newMessage")
            }

        }
        
        if (request.body.object) {
            if (
                request.body.entry &&
                request.body.entry[0].changes &&
                request.body.entry[0].changes[0] &&
                request.body.entry[0].changes[0].value.messages &&
                request.body.entry[0].changes[0].value.messages[0]
            ) {
              const from = request.body.entry[0].changes[0].value.messages[0].from;
              const msg_body = request.body.entry[0].changes[0].value.messages[0].text.body;
              const clientName = request.body.entry[0].changes[0].value.contacts[0].profile.name;

              const findAccount = await Account.findOne({
                numberPhone: from
            })
    
            if (!findAccount) {
                const account = await Account.create({
                    name: clientName,
                    numberPhone: from,
                    plataform: 'Whatsapp',
                })
    
                await Messages.create({
                    accountId: account._id,
                    message: msg_body,
                    isClient: true,
                })
        
            }

            const chat = await Messages.create({
                accountId: findAccount?._id,
                message: msg_body,
                isClient: true,
            })

            io.emit("newMessage")
              
            return response.json(chat)
            }
            response.sendStatus(200);
          } 
          return response.sendStatus(200)
    }

    async getChatByAccount(request: Request, response: Response): Promise<Response> {

        const { account } = request.query;

        const messages = await Messages.find({
            accountId: account
        })

        return response.json(messages)
    }
}