import {MigrationInterface, QueryRunner, Table, TableForeignKey} from "typeorm";

export class SellersOrdersTable1675023608762 implements MigrationInterface {

    async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query('CREATE EXTENSION IF NOT EXISTS "uuid-ossp"');
        await queryRunner.createTable(
            new Table({
                name: 'sellerOrders',
                columns: [
                    {
                        name: 'id',
                        type: 'uuid',
                        isPrimary: true,
                        generationStrategy: 'uuid',
                        default: 'uuid_generate_v4()',
                    },
                    {
                        name: 'answered',
                        type: 'boolean',
                        default: false,
                    },
                    {
                        name: 'points',
                        type: 'int',
                    },
                    {
                        name: 'sellerId',
                        type: 'uuid',
                    },
                    {
                        name: 'productId',
                        type: 'uuid',
                        isNullable: true
                    },
                    {
                        name: 'createdAt',
                        type: 'timestamp',
                        default: 'now()',
                    },
                    {
                        name: 'updatedAt',
                        type: 'timestamp',
                        default: 'now()',
                    },
                    {
                        name: 'deletedAt',
                        type: 'timestamp',
                        isNullable: true,
                    },
                ],
            }),
        );
        await queryRunner.createForeignKey(
            'sellerOrders',
            new TableForeignKey({
                name: 'sellerOrders_seller',
                columnNames: ['sellerId'],
                referencedColumnNames: ['id'],
                referencedTableName: 'sellers',
                onDelete: 'CASCADE',
                onUpdate: 'CASCADE',
            }),
        );
        await queryRunner.createForeignKey(
            'sellerOrders',
            new TableForeignKey({
                name: 'sellerOrders_product',
                columnNames: ['productId'],
                referencedColumnNames: ['id'],
                referencedTableName: 'products',
                onDelete: 'CASCADE',
                onUpdate: 'CASCADE',
            }),
        );
    }

    async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropForeignKey('sellerOrders', 'sellerOrders_product');
        await queryRunner.dropForeignKey('sellerOrders', 'sellerOrders_seller');
        await queryRunner.dropTable('sellerOrders');
    }

}
