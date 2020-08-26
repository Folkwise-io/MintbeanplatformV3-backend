import * as Knex from "knex";

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable("users", (table) => {
    table
      .uuid("id")
      .defaultTo(knex.raw("uuid_generate_v4()"))
      .unique()
      .notNullable();
    table.text("username").unique().notNullable();
    table.text("firstName").notNullable();
    table.text("lastName").notNullable();
    table.timestamp("createdAt").notNullable().defaultTo(knex.fn.now());

    // constraints and indices
    table.primary(["id"]);
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTable("users");
}
