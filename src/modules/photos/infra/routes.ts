import multer from 'multer';
import uploadConfig from '../../../config/upload';
import { Router } from 'express';
import { Controller } from './Controller';
import { celebrate, Joi, Segments } from 'celebrate';

export const router = Router();
const controller = new Controller();
const upload = multer(uploadConfig.multer);

router.post(
    '/:productId',
    upload.array('photos'),
    controller.create,
);

router.delete(
    '/:id',
    celebrate({
        [Segments.PARAMS]: {
            id: Joi.string().uuid().required(),
        },
    }),
    controller.remove,
);