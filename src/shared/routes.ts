import { Router } from 'express';
import { router as sellersRouter } from '../modules/sellers/infra/routes';
import { router as sessionsRouter } from '../modules/sessions/infra/routes';
import { router as clientsRouter } from '../modules/clients/infra/routes';
import { router as productsRouter } from '../modules/products/infra/routes';
import { router as shopRouter } from '../modules/shop/infra/routes';
import { router as photoRouter } from '../modules/photos/infra/routes';
import { router as orderRouter } from '../modules/orders/infra/routes';
import { router as chatRouter } from '../modules/chat/infra/routes';

export const routes = Router();
routes.use('/sellers', sellersRouter);
routes.use('/sessions', sessionsRouter);
routes.use('/clients', clientsRouter);
routes.use('/products', productsRouter);
routes.use('/shop', shopRouter);
routes.use('/photos', photoRouter);
routes.use('/orders', orderRouter);
routes.use('/chat', chatRouter);