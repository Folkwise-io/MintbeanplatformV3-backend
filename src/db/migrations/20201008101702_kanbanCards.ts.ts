import * as Knex from "knex";
import { KanbanCardStatusEnum } from "../../types/gqlGeneratedTypes";

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable("kanbanCards", (table) => {
    table.uuid("id").notNullable().defaultTo(knex.raw("uuid_generate_v4()")).unique();
    table.uuid("kanbanId").notNullable();
    table.text("title").notNullable();
    table.text("body").notNullable();
    table.text("status").notNullable().defaultTo(KanbanCardStatusEnum.Todo);
    table.timestamp("createdAt").notNullable().defaultTo(knex.fn.now());
    table.timestamp("updatedAt").notNullable().defaultTo(knex.fn.now());
    table.boolean("deleted").notNullable().defaultTo(false);

    // Constraints and indices
    table.primary(["id"]);
    table.foreign("kanbanId").references("kanbans.id").onDelete("CASCADE");
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTable("kanbanCards");
}
