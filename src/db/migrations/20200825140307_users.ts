import * as Knex from "knex";

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable("users", (table) => {
    table.uuid("id").notNullable().defaultTo(knex.raw("uuid_generate_v4()")).unique();
    table.text("email").notNullable().unique();
    table.text("firstName").notNullable();
    table.text("lastName").notNullable();
    table.text("passwordHash").notNullable();
    table.timestamp("createdAt").notNullable().defaultTo(knex.fn.now());
    table.timestamp("updatedAt").notNullable().defaultTo(knex.fn.now());
    table.boolean("isAdmin").notNullable().defaultTo(false);
    table.boolean("deleted").notNullable().defaultTo(false);

    // Constraints and indices
    table.primary(["id"]);
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTable("users");
}
