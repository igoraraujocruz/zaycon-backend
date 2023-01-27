import { Router } from 'express';
import { celebrate, Segments, Joi } from 'celebrate';
import { Controller } from './Controller';
import { ensureAuthenticated } from '../../sellers/infra/Middlewarer';
import { ensureSellerIsAdmin } from '../../shop/infra/Middlewarer';


export const router = Router();
const controller = new Controller();

router.post(
    '/',
    celebrate({
        [Segments.BODY]: {
            name: Joi.string().required(),
            cep: Joi.string(),
            email: Joi.string().required(),
            numberPhone: Joi.string().regex(/^\([1-9]{2}\) (?:[2-8]|9[1-9])[0-9]{3}\-[0-9]{4}$/).required(),
            logradouro: Joi.string(),
            bairro: Joi.string(),
            localidade: Joi.string(),
            uf: Joi.string(),
            residenceNumber: Joi.string(),
        },
    }),
    controller.create,
);

router.get('/', ensureAuthenticated, ensureSellerIsAdmin, controller.getAll)

router.post('/address', celebrate({
    [Segments.BODY]: {
        address: Joi.object({
            cep: Joi.string().required(),
            logradouro: Joi.string().required(),
            bairro: Joi.string().required(),
            localidade: Joi.string().required(),
            uf: Joi.string().required(),
            residenceNumber: Joi.string().required(),
        }).required()
    },
}), controller.getAddress)

