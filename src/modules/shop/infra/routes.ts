import { Router } from 'express';
import { celebrate, Segments, Joi } from 'celebrate';
import { Controller } from './Controller';

export const router = Router();
const controller = new Controller();

router.post(
    '/',
    celebrate({
        [Segments.BODY]: {
            clientId: Joi.string().required(),
            sellerId: Joi.string(),
            typeOfPayment: Joi.string()
                .required()
                .valid(
                    'pix',
                    'picpay',
                ),
        },
    }),
    controller.create,
);

router.post(
    '/charge',
    celebrate({
        [Segments.BODY]: {
            shopId: Joi.string().required(),
        },
    }),
    controller.generateCharge,
);

router.post(
    '/clientemailconfirmation',
    celebrate({
        [Segments.BODY]: {
            email: Joi.string().required(),
        },
    }),
    controller.sendEmailClientConfirmationShop,
);

router.post(
    '/adminemailconfirmation',
    celebrate({
        [Segments.BODY]: {
            email: Joi.string().required(),
        },
    }),
    controller.sendEmailAdminConfirmationShop,
);

router.get('/',
celebrate({
    [Segments.QUERY]: {
        sellerId: Joi.string().uuid(),
        shopId: Joi.string().uuid(),
    },
}),
controller.get)