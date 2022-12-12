import { Router } from 'express';
import { celebrate, Segments, Joi } from 'celebrate';
import { Controller } from './Controller';
import uploadConfig from '../../../config/upload';
import multer from 'multer';
import { ensureAuthenticated } from '../../sellers/infra/Middlewarer';
import { ensureSellerIsAdmin } from '../../shop/infra/Middlewarer';

export const router = Router();
const controller = new Controller();
const upload = multer(uploadConfig.multer);

router.post(
    '/',
    ensureAuthenticated,
    ensureSellerIsAdmin,
    upload.array('photos'),
    celebrate({
        [Segments.BODY]: {
            name: Joi.string().required(),
            description: Joi.string().required(),
            amount: Joi.number().required(),
            price: Joi.number().required(),
            points: Joi.number().required()
        },
    }),
    controller.create,
);

router.get('/', 
    celebrate({
        [Segments.QUERY]: {
            productSlug: Joi.string(),
            productId: Joi.string().uuid(),
            option: Joi.string(),
            page: Joi.number(),
            perPage: Joi.number()
        },
}), controller.get)

router.put(
    '/',
    ensureAuthenticated,
    ensureSellerIsAdmin,
    celebrate({
        [Segments.BODY]: {
            id: Joi.string().uuid().required(),
            name: Joi.string(),
            description: Joi.string(),
            price: Joi.number(),
            points: Joi.number(),
            amount: Joi.number(),
        },
    }),
    controller.update,
);
