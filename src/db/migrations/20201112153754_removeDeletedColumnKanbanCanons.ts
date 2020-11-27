import * as Knex from "knex";

export async function up(knex: Knex): Promise<void> {
  return knex.schema.table("kanbanCanons", function (t) {
    t.dropColumn("deleted");
  });
}

export async function down(knex: Knex): Promise<void> {}
