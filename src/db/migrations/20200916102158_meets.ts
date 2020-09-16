import * as Knex from "knex";

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable("meets", (table) => {
    table.uuid("id").notNullable().defaultTo(knex.raw("uuid_generate_v4()")).unique();
    table.enu("meetType", ["hackMeet"]).notNullable();
    table.text("title").notNullable().unique();
    table.text("description").notNullable();
    table.text("instructions").notNullable();
    table.text("registerLink");
    table.text("coverImageUrl").notNullable();
    table.timestamp("startTime").notNullable();
    table.timestamp("endTime").notNullable();
    table.text("region").notNullable().defaultTo("America/Toronto");
    table.timestamp("createdAt").notNullable().defaultTo(knex.fn.now());
    table.timestamp("updatedAt").notNullable().defaultTo(knex.fn.now());
    table.boolean("deleted").notNullable().defaultTo(false);

    table.primary(["id"]);
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTable("meets");
}
