import { Router } from 'express';
import { celebrate, Segments, Joi } from 'celebrate';
import { Controller } from './Controller';
import axios from 'axios';

export const router = Router();
const controller = new Controller();

router.post(
    '/',
    celebrate({
        [Segments.BODY]: {
            name: Joi.string().required(),
            cep: Joi.string().required(),
            email: Joi.string().required(),
            numberPhone: Joi.string().regex(/^\([1-9]{2}\) (?:[2-8]|9[1-9])[0-9]{3}\-[0-9]{4}$/).required(),
            address: Joi.string().required()
        },
    }),
    controller.create,
);

router.get('/', controller.getAll)