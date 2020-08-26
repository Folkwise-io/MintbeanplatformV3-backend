import * as Knex from "knex";

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable("posts", (table) => {
    table
      .uuid("id")
      .defaultTo(knex.raw("uuid_generate_v4()"))
      .unique()
      .notNullable();
    table.uuid("user_id").notNullable();
    table.text("body").notNullable();
    table.timestamp("created_at").notNullable().defaultTo(knex.fn.now());
    table.timestamp("updated_at").notNullable().defaultTo(knex.fn.now());

    // constraints and indices
    table.primary(["id"]);
    table.foreign("user_id").references("users.id").onDelete("CASCADE");
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTable("posts");
}
