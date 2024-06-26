import { inject, injectable } from 'tsyringe';
import { Product } from '../infra/Entity';
import { Update as IUpdate} from '../interfaces/update';
import { AppError } from '../../../shared/AppError';
import { contract } from '../interfaces/contract';

@injectable()
export class Update {
    constructor(
        @inject('Product')
        private repository: contract,
    ) {}

    public async execute({
        id,
        name,
        description,
        points,
        amount,
        price,
        destaque,
        category
    }: IUpdate): Promise<Product> {
        const product = await this.repository.findById(id);

        if (!product) {
            throw new AppError('Product not found');
        }

        const productNameAlreadyExist =
            await this.repository.findByName(name);

        if (
            id !== productNameAlreadyExist?.id &&
            name === productNameAlreadyExist?.name
        ) {
            throw new AppError('O nome do produto já está em uso');
        }

        product.name = name;
        product.description = description;
        product.points = points;
        product.amount = amount;
        product.price = price;
        product.destaque = destaque;
        product.category = category;
        
        return this.repository.save(product);
    }
}