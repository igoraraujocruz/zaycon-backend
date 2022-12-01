import 'reflect-metadata';
import 'dotenv/config';
import './container';
import './connection';
import { isCelebrateError } from 'celebrate';
import express, { Request, Response, NextFunction } from 'express';
import 'express-async-errors';
import { AppError } from './AppError';
import { routes } from './routes';
import uploadConfig from '../config/upload'
import cors from 'cors';
import { Repository } from '../modules/shop/infra/Repository';
import axios from 'axios';


const app = express()

app.use(express.json())
app.use('/photos', express.static(uploadConfig.uploadsFolder));
app.use(
    cors({
        origin: 'http://localhost:3000',
    }),
);

app.use(routes);

app.use((error: Error, _: Request, response: Response, __: NextFunction) => {
    if (error instanceof AppError) {
        const { statusCode } = error;
  
        return response.status(statusCode).json({
            status: 'error',
            message: error.message,
        });
    }
  
    if (isCelebrateError(error)) {
        const values = error.details.values();
        let { message } = values.next().value.details[0];
        message = message.replace('"', '').replace('"', '');
  
        return response.status(400).json({
            status: 'error',
            type: 'validation',
            message,
        });
    }
  
    return response.status(500).json({
        status: 'error',
        message: error.message,
    });
  });

app.post('/webhook(/pix)?', async (req, res) => {
    const txid = req.body.pix[0].txid

    const shopRepository = new Repository()    

    const shop = await shopRepository.getByTxid(txid)

    if(!shop) {
        throw new AppError('Shop not found')
    }

    await axios({
        method: 'POST',
        url: `${process.env.API_HOST}/shop/adminemailconfirmation/`,
        data: {
            email: process.env.ADMIN_EMAIL
        }
    })

    await axios({
        method: 'POST',
        url: `${process.env.API_HOST}/shop/clientemailconfirmation/`,
        data: {
            email: shop.client.email
        }
    })
  
    return res.send('200')
  })

app.listen(3333, () => {
    console.log('Server started on port 3333')
})