import {MigrationInterface, QueryRunner, Table} from "typeorm";

export class TokenTable1669163989181 implements MigrationInterface {

    async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(
            new Table({
                name: 'tokens',
                columns: [
                    {
                        name: 'id',
                        type: 'uuid',
                        isPrimary: true,
                        generationStrategy: 'uuid',
                        default: 'uuid_generate_v4()',
                    },
                    {
                        name: 'refreshToken',
                        type: 'varchar',
                    },
                    {
                        name: 'sellerId',
                        type: 'uuid',
                    },
                    {
                        name: 'expiresDate',
                        type: 'timestamp',
                    },
                    {
                        name: 'createdAt',
                        type: 'timestamp',
                        default: 'now()',
                    },
                ],
                foreignKeys: [
                    {
                        name: 'FKSellerToken',
                        referencedTableName: 'sellers',
                        referencedColumnNames: ['id'],
                        columnNames: ['sellerId'],
                        onDelete: 'CASCADE',
                        onUpdate: 'CASCADE',
                    },
                ],
            }),
        );
    }

    async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable('FKSellerToken');
    }

}
