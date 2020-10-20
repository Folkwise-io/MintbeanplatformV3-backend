import * as Knex from "knex";
import kanban from "../../graphql/typedef/kanban";
import { KanbanCardStatusEnum } from "../../types/gqlGeneratedTypes";

const kanbanCardStatuses = Object.values(KanbanCardStatusEnum);

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable("kanbanSessionCards", (table) => {
    table.uuid("id").notNullable().defaultTo(knex.raw("uuid_generate_v4()")).unique();
    table.uuid("kanbanCardId").notNullable();
    table.uuid("kanbanSessionId").notNullable();
    table.text("status").notNullable();
    table.timestamp("createdAt").notNullable().defaultTo(knex.fn.now());
    table.timestamp("updatedAt").notNullable().defaultTo(knex.fn.now());
    table.boolean("deleted").notNullable().defaultTo(false);

    // Constraints and indices
    table.primary(["id"]);
    table.foreign("kanbanCardId").references("kanbanCards.id").onDelete("CASCADE");
    table.foreign("kanbanSessionId").references("kanbanSessions.id").onDelete("CASCADE");
    // can only store one reference to a kanban card in a kanban session
    table.unique(["kanbanCardId", "kanbanSessionId"]);
  });
}

export async function down(knex: Knex): Promise<void> {}
