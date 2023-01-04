import { Request, Response } from 'express';
import Account from '../../../schemas/Chat'
import Messages from '../../../schemas/Messages'
import { io } from '../../../shared/http';


export class Controller {
    async getChat(request: Request, response: Response): Promise<Response> {
        const account = await Account.find()

        return response.json(account)
    }

    async createAccount(request: Request, response: Response): Promise<Response> {
        const { entry } = request.body;
        const from = entry[0].changes[0].value.messages[0].from;
        const msg_body = entry[0].changes[0].value.messages[0].text.body;

        console.log(from, msg_body)
        return entry;
        // if (request.body.object) {
        //     if (
        //         request.body.entry &&
        //         request.body.entry[0].changes &&
        //         request.body.entry[0].changes[0] &&
        //         request.body.entry[0].changes[0].value.messages &&
        //         request.body.entry[0].changes[0].value.messages[0]
        //     ) {
        //       const phone_number_id =
        //       request.body.entry[0].changes[0].value.metadata.phone_number_id;
        //       const from = request.body.entry[0].changes[0].value.messages[0].from;
        //       const msg_body = request.body.entry[0].changes[0].value.messages[0].text.body;
      
        //       io.emit("newMessage") 

        //       const findAccount = await Account.findOne({
        //         numberPhone: from
        //     })
    
        //     if (!findAccount) {
        //         const account = await Account.create({
        //             name: 'Teste',
        //             numberPhone: from,
        //             plataform: 'Whatsapp',
        //         })
    
        //         await Messages.create({
        //             accountId: account._id,
        //             message: msg_body
        //         })
        
        //     }

        //     const chat = await Messages.create({
        //         accountId: findAccount?._id,
        //         message: msg_body
        //     })
              
        //     return response.json(chat)
        //     }
        //     response.sendStatus(200);
        //   } else {
        //     response.sendStatus(404);
        //   }
        //   return response.json(chat)
          
    }

    async getChatByAccount(request: Request, response: Response): Promise<Response> {

        const { account } = request.query;

        const messages = await Messages.find({
            accountId: account
        })

        return response.json(messages)
    }
}