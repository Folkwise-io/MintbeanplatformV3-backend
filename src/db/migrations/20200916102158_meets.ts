import * as Knex from "knex";

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable("meets", (table) => {
    table.uuid("id").notNullable().defaultTo(knex.raw("uuid_generate_v4()")).unique();
    table.text("title").notNullable().unique();
    table.text("description").notNullable();
    table.text("coverImageUrl");
    table.text("instructions").notNullable();
    table.timestamp("startTime", { useTz: false }).notNullable();
    table.timestamp("endTime", { useTz: false }).notNullable();
    table.text("region").notNullable().defaultTo("America/Toronto");
    table.text("registerLink").notNullable();
    table.timestamp("createdAt").notNullable().defaultTo(knex.fn.now());
    table.timestamp("updatedAt").notNullable().defaultTo(knex.fn.now());
    table.boolean("deleted").notNullable().defaultTo(false);

    table.primary(["id"]);
  });
}

export async function down(knex: Knex): Promise<void> {}
