import { Router } from 'express';
import { celebrate, Segments, Joi } from 'celebrate';
import { Controller } from './Controller';


export const router = Router();
const controller = new Controller();

router.get('/', controller.getChat)

router.post('/',
    celebrate({
        [Segments.BODY]: {
            name: Joi.string().required(),
            plataform: Joi.string().required(),
            message: Joi.string().required(),
            numberPhone: Joi.string().regex(/^\([1-9]{2}\) (?:[2-8]|9[1-9])[0-9]{3}\-[0-9]{4}$/).required()
        },
    }), controller.teste)

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

router.post("/webhook", controller.createAccount);

router.post("/instagram/webhook", controller.instagramWebHook);

router.get("/instagram/webhook", controller.verifyWebHook);


