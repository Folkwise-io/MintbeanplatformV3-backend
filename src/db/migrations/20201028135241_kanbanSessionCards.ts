import * as Knex from "knex";

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable("kanbanSessionCards", (table) => {
    table.uuid("id").notNullable().defaultTo(knex.raw("uuid_generate_v4()")).unique();
    table.uuid("kanbanCanonCardId").notNullable();
    table.uuid("kanbanSessionId").notNullable();
    table.text("status").nullable();
    table.timestamp("createdAt").notNullable().defaultTo(knex.fn.now());
    table.timestamp("updatedAt").notNullable().defaultTo(knex.fn.now());
    table.boolean("deleted").notNullable().defaultTo(false);

    // Constraints and indices
    table.primary(["kanbanCanonCardId", "kanbanSessionId"]);
    table.foreign("kanbanCanonCardId").references("kanbanCanonCards.id").onDelete("CASCADE");
    table.foreign("kanbanSessionId").references("kanbanSessions.id").onDelete("CASCADE");

    // can only store one reference to a kanbanCanonCard in a given kanbanSession
    table.unique(["kanbanCanonCardId", "kanbanSessionId"]);
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTable("kanbanSessionCards");
}
