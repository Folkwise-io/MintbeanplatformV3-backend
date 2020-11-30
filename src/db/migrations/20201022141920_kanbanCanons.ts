import * as Knex from "knex";

const defaultPositions = {
  todo: [],
  wip: [],
  done: [],
};

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable("kanbanCanons", (table) => {
    table.uuid("id").notNullable().defaultTo(knex.raw("uuid_generate_v4()")).unique();
    table.text("title").notNullable();
    table.text("description").notNullable();
    table.jsonb("cardPositions").defaultTo(JSON.stringify(defaultPositions));
    table.timestamp("createdAt").notNullable().defaultTo(knex.fn.now());
    table.timestamp("updatedAt").notNullable().defaultTo(knex.fn.now());
    table.boolean("deleted").notNullable().defaultTo(false);

    // Constraints and indices
    table.primary(["id"]);
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTable("kanbanCanons");
}
