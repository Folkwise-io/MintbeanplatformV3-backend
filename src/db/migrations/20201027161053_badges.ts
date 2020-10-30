import * as Knex from "knex";

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable("badges", (table) => {
    table.uuid("id").notNullable().defaultTo(knex.raw("uuid_generate_v4()")).unique();
    table.text("alias").notNullable().unique();
    table.enu("badgeShape", ["circle", "square", "star"]).notNullable();
    table.string("backgroundHex", 6).defaultTo("000000");
    table.string("iconHex", 6).defaultTo("ffffff");
    table.text("title").notNullable();
    table.text("description");
    table.integer("weight").notNullable().defaultTo(0);
    table.timestamp("createdAt").notNullable().defaultTo(knex.fn.now());

    table.primary(["id"]);
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTable("badges");
}
