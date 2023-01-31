import { Router } from 'express';
import { celebrate, Segments, Joi } from 'celebrate';
import { Controller } from './Controller';
import { ensureAuthenticated } from '../../sellers/infra/Middlewarer';
import { ensureSellerIsAdmin } from './Middlewarer';

export const router = Router();
const controller = new Controller();

router.post(
    '/',
    celebrate({
        [Segments.BODY]: {
            clientId: Joi.string().required(),
            socketId: Joi.string().required(),
            sellerId: Joi.string(),
            typeOfPayment: Joi.string()
                .required()
                .valid(
                    'pix',
                ),
        },
    }),
    controller.create,
);

router.post(
    '/gerencianet',
    celebrate({
        [Segments.BODY]: {
            shopId: Joi.string().required(),
        },
    }),
    controller.generateGerencianetCharge,
); 


router.post(
    '/gerencianet/webhook(/pix)?',
    (req, res) => {
        res.send(200)
    }
    // celebrate({
    //     [Segments.BODY]: {
    //         pix: Joi.array().required(),
    //     },
    // }), controller.receiveConfirmationPix   
);

router.get('/',
celebrate({
    [Segments.QUERY]: {
        sellerId: Joi.string().uuid(),
        shopId: Joi.string().uuid(),
    },
}),
ensureAuthenticated,
ensureSellerIsAdmin,
controller.get)

router.patch('/', celebrate({
    [Segments.BODY]: {
        shopId: Joi.string().uuid().required(),
        status: Joi.string().required().valid(
            'Preparando',
            'Enviado',
            'Entregue'
        ),
    },
}), ensureAuthenticated, ensureSellerIsAdmin, controller.updateStatus)