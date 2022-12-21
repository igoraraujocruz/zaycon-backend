import { getRepository, Repository as TypeormRepository } from 'typeorm';
import { contract } from '../interfaces/contract';
import { Product } from './Entity';
import { create } from '../interfaces/create'

export class Repository implements contract {
    private ormRepository: TypeormRepository<Product>;

    constructor() {
        this.ormRepository = getRepository(Product);
    }

    async create({ name, description, amount, price, slug, points, category, destaque }: create): Promise<Product> {
        const item = this.ormRepository.create({ name, description, amount, price, slug, points, category, destaque });

        await this.ormRepository.save(item);

        return item;
    }

    async getAll(): Promise<Product[]> {
        const items = this.ormRepository.find();

        return items;
    }

    async getByCategory(category: string): Promise<Product[]> {
        const items = await this.ormRepository.find({
            where: { category }
        });



        return items;
    }


    async findBySlug(slug: string): Promise<Product | undefined> {
        const product = this.ormRepository.findOne({
            where: { slug },
        });

        return product;
    }

    async findById(productId: string): Promise<Product | undefined> {
        const item = this.ormRepository.findOne({
            where: { id: productId },
        });

        return item;
    }

    async findByName(name: string): Promise<Product | undefined> {
        const item = this.ormRepository.findOne({
            where: { name },
        });

        return item;
    }
    
    async findAllByName(name: string): Promise<Product[]> {
        const item = this.ormRepository
        .createQueryBuilder('product')
        .leftJoinAndSelect('product.photos', 'photos')
        .leftJoinAndSelect('product.user', 'user')
        .where('LOWER(product.name) = LOWER(:name)', { name })
        .getMany();

        return item;
    }

    async save(item: Product): Promise<Product> {
        return this.ormRepository.save(item);
    }
}