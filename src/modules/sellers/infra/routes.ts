import { Router } from 'express';
import { celebrate, Segments, Joi } from 'celebrate';
import { Controller } from './Controller';
import { ensureAuthenticated } from './Middlewarer';

export const router = Router();
const controller = new Controller();

router.post(
    '/',
    celebrate({
        [Segments.BODY]: {
            name: Joi.string().required(),
            username: Joi.string().required(),
            email: Joi.string().required(),
            numberPhone: Joi.string().regex(/^[1-9]{2}[9]\d{8}$/).required(),
            password: Joi.string().required(),
            birthday: Joi.date().required()
        },
    }),
    controller.create,
);

router.get('/', celebrate({
    [Segments.QUERY]: {
        sellerName: Joi.string(),
        sellerUsername: Joi.string(),
    },
}), controller.get)

router.get('/me', ensureAuthenticated, controller.getMe)