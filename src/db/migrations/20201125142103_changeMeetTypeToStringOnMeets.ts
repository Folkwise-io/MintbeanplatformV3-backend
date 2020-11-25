import * as Knex from "knex";

//knex raw must be used because alter enum is not supported

export async function up(knex: Knex): Promise<void> {
  await knex.schema.raw(`
  ALTER TABLE "meets" DROP CONSTRAINT "meets_meetType_check"
  `);
  const result = await knex.schema.alterTable("meets", (table) => {
    table.string("meetType").notNullable().defaultTo("hackathon").alter();
  });
  return result;
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.alterTable("meets", (table) => {
    table.enu("meetType", ["hackMeet"]).notNullable().alter();
  });
  const result = await knex.schema.raw(`
  ALTER TABLE "meets" ADD CONSTRAINT "meets_meetType_check"
  `);
  return result;
}
