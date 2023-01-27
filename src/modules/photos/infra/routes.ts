import multer from 'multer';
import uploadConfig from '../../../config/upload';
import { Router } from 'express';
import { Controller } from './Controller';
import { celebrate, Joi, Segments } from 'celebrate';
import { ensureAuthenticated } from '../../sellers/infra/Middlewarer';
import { ensureSellerIsAdmin } from '../../shop/infra/Middlewarer';

export const router = Router();
const controller = new Controller();
const upload = multer(uploadConfig.multer);

router.post(
    '/:productId',
    ensureAuthenticated,
    ensureSellerIsAdmin,
    upload.array('photos'),
    controller.create,
);

router.delete(
    '/:id',
    ensureAuthenticated,
    ensureSellerIsAdmin,
    celebrate({
        [Segments.PARAMS]: {
            id: Joi.string().uuid().required(),
        },
    }),
    
    controller.remove,
);