import { Router } from 'express';
import { celebrate, Segments, Joi } from 'celebrate';
import { Controller } from './Controller';
import { ensureAuthenticated } from './Middlewarer';
import { ensureSellerIsAdmin } from '../../shop/infra/Middlewarer';

export const router = Router();
const controller = new Controller();

router.post(
    '/',
    celebrate({
        [Segments.BODY]: {
            name: Joi.string().required(),
            username: Joi.string().required().regex(/^[a-zA-Z0-9]+$/),
            email: Joi.string().required(),
            numberPhone: Joi.string().regex(/^\([1-9]{2}\) (?:[2-8]|9[1-9])[0-9]{3}\-[0-9]{4}$/).required(),
            password: Joi.string().required().min(6),
            birthday: Joi.date().required()
        },
    }),
    controller.create,
);

router.post(
    '/confirmEmail/:token',
    celebrate({
        [Segments.PARAMS]: {
            token: Joi.string().required().uuid(),
        },
    }),
    controller.confirmEmail,
);

router.post(
    '/forgotPassword',
    celebrate({
        [Segments.BODY]: {
            email: Joi.string().email().required(),
        },
    }),
    controller.forgotPassword,
);

router.post(
    '/reset/:token',
    celebrate({
        [Segments.PARAMS]: {
            token: Joi.string().uuid().required(),
        },
        [Segments.BODY]: {
            password: Joi.string().required().min(6),
            password_confirmation: Joi.string()
                .min(6)
                .required()
                .valid(Joi.ref('password')),
        },
    }),
    controller.resetPassword,
);

router.get('/', ensureAuthenticated, ensureSellerIsAdmin, celebrate({
    [Segments.QUERY]: {
        sellerName: Joi.string(),
        sellerUsername: Joi.string(),
        sellerId: Joi.string(),
    },
}), controller.get)

router.get('/me', ensureAuthenticated, controller.getMe)