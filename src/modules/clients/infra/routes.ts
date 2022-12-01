import { Router } from 'express';
import { celebrate, Segments, Joi } from 'celebrate';
import { Controller } from './Controller';

export const router = Router();
const controller = new Controller();

router.post(
    '/',
    celebrate({
        [Segments.BODY]: {
            name: Joi.string().required(),
            cep: Joi.string().required(),
            email: Joi.string().required(),
            numberPhone: Joi.string().required(),
            address: Joi.string().required()
        },
    }),
    controller.create,
);

router.get('/', controller.getAll)