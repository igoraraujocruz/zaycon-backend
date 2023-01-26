import {MigrationInterface, QueryRunner, TableColumn} from "typeorm";

export class ClientUpdate1674749849437 implements MigrationInterface {

    async up(queryRunner: QueryRunner): Promise<void> {

        await queryRunner.query(
            `ALTER TABLE "clients" RENAME COLUMN "address" TO "logradouro"`,
        )

        await queryRunner.query(
            `ALTER TABLE "clients" ALTER COLUMN "logradouro" DROP NOT NULL`,
        )

        await queryRunner.query(
            `ALTER TABLE "clients" ALTER COLUMN "cep" DROP NOT NULL`,
        )

        await queryRunner.addColumn(
            "clients",
            new TableColumn({
                name: "bairro",
                type: "varchar",
                isNullable: true
            }),
        )
        await queryRunner.addColumn(
            "clients",
            new TableColumn({
                name: "localidade",
                type: "varchar",
                isNullable: true
            }),
        )

        await queryRunner.addColumn(
            "clients",
            new TableColumn({
                name: "uf",
                type: "varchar",
                isNullable: true
            }),
        )

        await queryRunner.addColumn(
            "clients",
            new TableColumn({
                name: "residenceNumber",
                type: "varchar",
                isNullable: true
            }),
        )
    }

    async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropColumn(
            "clients",
            new TableColumn({
                name: "residenceNumber",
                type: "varchar",
                isNullable: true
            }),
        )

        await queryRunner.dropColumn(
            "clients",
            new TableColumn({
                name: "uf",
                type: "varchar",
                isNullable: true
            }),
        )

        await queryRunner.dropColumn(
            "clients",
            new TableColumn({
                name: "localidade",
                type: "varchar",
                isNullable: true
            }),
        )

        await queryRunner.dropColumn(
            "clients",
            new TableColumn({
                name: "bairro",
                type: "varchar",
                isNullable: true
            }),
        )

        await queryRunner.query(
            `ALTER TABLE "clients" ALTER COLUMN "cep" SET NOT NULL`,
        )

        await queryRunner.query(
            `ALTER TABLE "clients" ALTER COLUMN "logradouro" SET NOT NULL`,
        )

        await queryRunner.query(
            `ALTER TABLE "clients" RENAME COLUMN "logradouro" TO "address"`,
        )
    }

}
