import { MigrationInterface, QueryRunner } from "typeorm";

export class InitialMigration1740931564681 implements MigrationInterface {
    name = 'InitialMigration1740931564681'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "fleet" ("id" SERIAL NOT NULL, "resourceId" character varying NOT NULL, "userId" character varying NOT NULL, CONSTRAINT "UQ_2e10523512eb3ba5bd5142965e3" UNIQUE ("resourceId"), CONSTRAINT "PK_17e0760d2492f67c67ce0fe4aa7" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "vehicle" ("id" SERIAL NOT NULL, "resourceId" character varying NOT NULL, "parkedLocation" json, CONSTRAINT "UQ_41c2627f1e725827915cca0fb87" UNIQUE ("resourceId"), CONSTRAINT "PK_187fa17ba39d367e5604b3d1ec9" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "fleet_vehicles_vehicle" ("fleetId" integer NOT NULL, "vehicleId" integer NOT NULL, CONSTRAINT "PK_470f59315dc5f9bbc65307a64ce" PRIMARY KEY ("fleetId", "vehicleId"))`);
        await queryRunner.query(`CREATE INDEX "IDX_deb4414d9c97dadb8ee6398da6" ON "fleet_vehicles_vehicle" ("fleetId") `);
        await queryRunner.query(`CREATE INDEX "IDX_c78b3b4fcac081458245880a1d" ON "fleet_vehicles_vehicle" ("vehicleId") `);
        await queryRunner.query(`ALTER TABLE "fleet_vehicles_vehicle" ADD CONSTRAINT "FK_deb4414d9c97dadb8ee6398da69" FOREIGN KEY ("fleetId") REFERENCES "fleet"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "fleet_vehicles_vehicle" ADD CONSTRAINT "FK_c78b3b4fcac081458245880a1d9" FOREIGN KEY ("vehicleId") REFERENCES "vehicle"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "fleet_vehicles_vehicle" DROP CONSTRAINT "FK_c78b3b4fcac081458245880a1d9"`);
        await queryRunner.query(`ALTER TABLE "fleet_vehicles_vehicle" DROP CONSTRAINT "FK_deb4414d9c97dadb8ee6398da69"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_c78b3b4fcac081458245880a1d"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_deb4414d9c97dadb8ee6398da6"`);
        await queryRunner.query(`DROP TABLE "fleet_vehicles_vehicle"`);
        await queryRunner.query(`DROP TABLE "vehicle"`);
        await queryRunner.query(`DROP TABLE "fleet"`);
    }

}
