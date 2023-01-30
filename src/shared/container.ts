import { container } from 'tsyringe';

import './providers';

import { contract as sellerContract } from '../modules/sellers/interfaces/contract';
import { Repository as SellerRepository } from '../modules/sellers/infra/Repository';

import { contract as sessionContract } from '../modules/sessions/interfaces/contract';
import { Repository as TokenRepository } from '../modules/sessions/infra/Repository';

import { contract as clientContract } from '../modules/clients/interfaces/contract';
import { Repository as ClientRepository } from '../modules/clients/infra/Repository';

import { contract as productContract } from '../modules/products/interfaces/contract';
import { Repository as ProductRepository } from '../modules/products/infra/Repository';

import { contract as shopContract } from '../modules/shop/interfaces/contract';
import { Repository as ShopRepository } from '../modules/shop/infra/Repository';

import { contract as photoContract } from '../modules/photos/interfaces/contract';
import { Repository as photoRepository } from '../modules/photos/infra/Repository';

import { contract as orderContract } from '../modules/orders/interfaces/contract';
import { Repository as orderRepository } from '../modules/orders/infra/Repository';

import { contract as sellerOrdersContract } from '../modules/sellerOrders/interfaces/contract';
import { Repository as sellerOrdersRepository } from '../modules/sellerOrders/infra/Repository';


container.registerSingleton<sellerContract>(
    'Seller',
    SellerRepository,
);

container.registerSingleton<sessionContract>(
    'Token',
    TokenRepository,
);

container.registerSingleton<clientContract>(
    'Client',
    ClientRepository,
);

container.registerSingleton<productContract>(
    'Product',
    ProductRepository,
);

container.registerSingleton<shopContract>(
    'Shop',
    ShopRepository,
);

container.registerSingleton<photoContract>(
    'Photo',
    photoRepository,
);

container.registerSingleton<orderContract>(
    'Order',
    orderRepository,
);

container.registerSingleton<sellerOrdersContract>(
    'SellerOrders',
    sellerOrdersRepository,
);