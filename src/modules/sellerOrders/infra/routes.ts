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
            productId: Joi.string(),
        },
    }),
    ensureAuthenticated,
    controller.create,
);

router.patch(
    '/:sellerOrderId',
    celebrate({
        [Segments.PARAMS]: {
            sellerOrderId: Joi.string().required(),
        },
    }),
    ensureAuthenticated,
    ensureSellerIsAdmin,
    controller.update,
);