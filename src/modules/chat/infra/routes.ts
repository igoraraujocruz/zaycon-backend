import { Router } from 'express';
import { celebrate, Segments, Joi } from 'celebrate';
import { Controller } from './Controller';
import { io } from '../../../shared/http';
import axios from 'axios';

export const router = Router();
const controller = new Controller();

router.get('/chat', controller.getChat)

router.post('/chat',
    celebrate({
        [Segments.BODY]: {
            name: Joi.string().required(),
            plataform: Joi.string().required(),
            message: Joi.string().required(),
            numberPhone: Joi.string().regex(/^\([1-9]{2}\) (?:[2-8]|9[1-9])[0-9]{3}\-[0-9]{4}$/).required()
        },
    }), controller.createAccount)

router.get('/chatByAccount', celebrate({
    [Segments.QUERY]: {
        account: Joi.string().required(),
    },
}), controller.getChatByAccount)

router.get("/webhook", (req, res) => {

  let mode = req.query["hub.mode"];
  let token = req.query["hub.verify_token"];
  let challenge = req.query["hub.challenge"];

  if (mode && token) {

    if (mode === "subscribe" && token === process.env.VERIFY_TOKEN) {

      console.log("WEBHOOK_VERIFIED");
      res.status(200).send(challenge);
    } else {

      res.sendStatus(403);
    }
  }
});

router.post("/webhook", (req, res) => {  
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
            process.env.WHATSAPP_TOKEN,
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


