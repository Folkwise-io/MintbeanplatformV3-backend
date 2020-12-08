import * as Knex from "knex";

export async function up(knex: Knex): Promise<void> {
  await knex.schema.raw(`
  ALTER TABLE "badges" DROP CONSTRAINT "badges_badgeShape_check"
  `);
  const result = await knex.schema.alterTable("badges", (table) => {
    table.text("badgeShape").notNullable().alter();
  });
  return result;
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.alterTable("meets", (table) => {
    table.enu("badgeShape", ["circle", "square", "star"]).notNullable();
  });
  const result = await knex.schema.raw(`
  ALTER TABLE "meets" ADD CONSTRAINT "badges_badgeShape_check"
  `);
  return result;
}
