import * as Knex from "knex";

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable("badgesProjects", (table) => {
    table.uuid("id").notNullable().defaultTo(knex.raw("uuid_generate_v4()")).unique();
    table.uuid("projectId").notNullable();
    table.uuid("badgeId").notNullable();
    table.timestamp("createdAt").notNullable().defaultTo(knex.fn.now());
    table.timestamp("updatedAt").notNullable().defaultTo(knex.fn.now());

    // Constraints and indices
    table.primary(["id"]);
    table.unique(["projectId", "badgeId"]);
    table.foreign("projectId").references("projects.id").onDelete("CASCADE");
    table.foreign("badgeId").references("badges.id").onDelete("CASCADE");
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTable("badgesProjects");
}
