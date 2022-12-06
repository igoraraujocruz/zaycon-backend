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
import http from 'http'
import { Server } from 'socket.io';

const app = express()

app.use(express.json())
app.use('/photos', express.static(uploadConfig.uploadsFolder));
app.use(
    cors({
        origin: `${process.env.WEB_HOST}`,
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

const serverHttp = http.createServer(app)

const io = new Server(serverHttp, {
    cors: {
        origin: process.env.WEB_HOST,
        methods: ["GET", "POST"],
      },
})

export { serverHttp, io }