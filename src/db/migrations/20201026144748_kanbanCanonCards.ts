import * as Knex from "knex";
import { KanbanCanonCardStatusEnum } from "../../types/gqlGeneratedTypes";

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable("kanbanCanonCards", (table) => {
    table.uuid("id").notNullable().defaultTo(knex.raw("uuid_generate_v4()")).unique();
    table.uuid("kanbanCanonId").notNullable();
    table.text("title").notNullable();
    table.text("body").notNullable();
    // TODO: change name to initialStatus?
    table.text("status").notNullable().defaultTo(KanbanCanonCardStatusEnum.Todo);
    table.timestamp("createdAt").notNullable().defaultTo(knex.fn.now());
    table.timestamp("updatedAt").notNullable().defaultTo(knex.fn.now());
    table.boolean("deleted").notNullable().defaultTo(false);

    // Constraints and indices
    table.primary(["id"]);
    table.unique(["kanbanCanonId", "id"]); // kanban canon cards must be unique on kanban canon
    table.foreign("kanbanCanonId").references("kanbanCanons.id").onDelete("CASCADE");
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTable("kanbanCanonCards");
}
