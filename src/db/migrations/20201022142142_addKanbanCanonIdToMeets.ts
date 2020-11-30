import * as Knex from "knex";

export async function up(knex: Knex): Promise<void> {
  return knex.schema.table("meets", function (t) {
    t.uuid("kanbanCanonId");
    t.foreign("kanbanCanonId").references("kanbanCanons.id").onDelete("SET NULL");
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.table("meets", function (t) {
    t.dropColumn("kanbanCanonId");
  });
}
