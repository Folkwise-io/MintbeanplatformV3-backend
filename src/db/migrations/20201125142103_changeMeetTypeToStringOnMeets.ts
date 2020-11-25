import * as Knex from "knex";

export async function up(knex: Knex): Promise<void> {
  return knex.schema.raw(`
  ALTER TABLE "meets" DROP CONSTRAINT "meets_meetType_check"
  `);
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.raw(`
  ALTER TABLE "meets" ADD CONSTRAINT "meets_meetType_check"
  `);
}
