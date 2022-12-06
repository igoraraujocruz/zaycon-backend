import {MigrationInterface, QueryRunner, Table} from "typeorm";

export class SellersTable1669159036543 implements MigrationInterface {

    async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query('CREATE EXTENSION IF NOT EXISTS "uuid-ossp"');
        await queryRunner.createTable(
            new Table({
                name: 'sellers',
                columns: [
                    {
                        name: 'id',
                        type: 'uuid',
                        isPrimary: true,
                        generationStrategy: 'uuid',
                        default: 'uuid_generate_v4()',
                    },
                    {
                        name: 'name',
                        type: 'varchar',
                    },
                    {
                        name: 'username',
                        type: 'varchar',
                    },
                    {
                        name: 'points',
                        type: 'int',
                        default: 0,
                    },
                    {
                        name: 'email',
                        type: 'varchar',
                    },
                    {
                        name: 'numberPhone',
                        type: 'varchar',
                    },
                    {
                        name: 'emailConfirm',
                        type: 'boolean',
                        default: false,
                    },
                    {
                        name: 'isAdmin',
                        type: 'boolean',
                        default: true,
                    },
                    {
                        name: 'password',
                        type: 'varchar',
                    },
                    {
                        name: 'birthday',
                        type: 'timestamp',
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
    }

    async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable('sellers');
    }

}
