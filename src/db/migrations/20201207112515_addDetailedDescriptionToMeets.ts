import * as Knex from "knex";

export async function up(knex: Knex): Promise<void> {
  return knex.schema.table("meets", (table) => {
    table.text("detailedDescription");
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.table("meets", (table) => {
    table.dropColumn("detailedDescription");
  });
}
