import * as Knex from "knex";

export async function up(knex: Knex): Promise<void> {
  return knex.schema.table("meets", function (t) {
    t.uuid("kanbanId");
    t.foreign("kanbanId").references("kanbans.id").onDelete("SET NULL");
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.table("meets", function (t) {
    t.dropColumn("kanbanId");
  });
}
