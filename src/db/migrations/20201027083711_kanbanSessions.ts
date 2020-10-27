import * as Knex from "knex";

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable("kanbanSessions", (table) => {
    table.uuid("id").notNullable().defaultTo(knex.raw("uuid_generate_v4()")).unique();
    table.uuid("kanbanCanonId").notNullable();
    table.uuid("userId").notNullable();
    table.uuid("meetId");
    table.timestamp("createdAt").notNullable().defaultTo(knex.fn.now());
    table.timestamp("updatedAt").notNullable().defaultTo(knex.fn.now());
    table.boolean("deleted").notNullable().defaultTo(false);

    // Constraints and indices
    table.primary(["id"]);
    table.foreign("kanbanCanonId").references("kanbanCanons.id").onDelete("CASCADE");
    table.foreign("userId").references("users.id").onDelete("CASCADE");
    table.foreign("meetId").references("meets.id").onDelete("SET NULL");
    // only one session per user per meet for any given kanbanCanon
    table.unique(["kanbanCanonId", "userId", "meetId"]);
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTable("kanbanSessions");
}
