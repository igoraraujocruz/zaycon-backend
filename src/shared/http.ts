'use strict';
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
import axios from 'axios';

const app = express()

app.use(express.json())
app.use('/photos', express.static(uploadConfig.uploadsFolder));
app.use(
    cors({
        origin: `${process.env.WEB_HOST}`,
    }),
);

app.use(routes);

const token = 'EAAIDCZAW59wIBAN4SlxqxLnkS4HXXaiXZCirRbgR7ZAzrMKgJtSHQtSXhnnpHPV9oSp3eMWZCa2fXkPLpP6UrT3YZC9FCcxnqZCs8tWSPntiPdNfwOJx5clZAkb19qK7iVzrgs3t23cNIukKDxHZCZBytD0Fqv5IyuZCiYvtHVZAIEl09ZBYcZCjNgZBsouUZCYcD7hPqa5i3ZAg3t6oRHQtVzB6wSR89Lgjo4vwIzMZD'

app.get("/webhook", (req, res) => {
  const verify_token = 'token123';

  let mode = req.query["hub.mode"];
  let token = req.query["hub.verify_token"];
  let challenge = req.query["hub.challenge"];

  if (mode && token) {

    if (mode === "subscribe" && token === verify_token) {

      console.log("WEBHOOK_VERIFIED");
      res.status(200).send(challenge);
    } else {

      res.sendStatus(403);
    }
  }
});

app.post("/webhook", (req, res) => {
    let body = req.body;
  
    console.log(JSON.stringify(req.body, null, 2));
  
    if (req.body.object) {
      if (
        req.body.entry &&
        req.body.entry[0].changes &&
        req.body.entry[0].changes[0] &&
        req.body.entry[0].changes[0].value.messages &&
        req.body.entry[0].changes[0].value.messages[0]
      ) {
        let phone_number_id =
          req.body.entry[0].changes[0].value.metadata.phone_number_id;
        let from = req.body.entry[0].changes[0].value.messages[0].from;
        let msg_body = req.body.entry[0].changes[0].value.messages[0].text.body;
        axios({
          method: "POST",
          url:
            "https://graph.facebook.com/v12.0/" +
            phone_number_id +
            "/messages?access_token=" +
            token,
          data: {
            messaging_product: "whatsapp",
            to: from,
            text: { body: "Ack: " + msg_body },
          },
          headers: { "Content-Type": "application/json" },
        });
      }
      res.sendStatus(200);
    } else {
      res.sendStatus(404);
    }
  });

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