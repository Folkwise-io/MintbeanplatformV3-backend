import * as Knex from "knex";

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable("projectMediaAssets", (table) => {
    table.uuid("id").notNullable().defaultTo(knex.raw("uuid_generate_v4()")).unique();
    table.uuid("projectId").notNullable();
    table.uuid("mediaAssetId").notNullable();
    table.timestamp("createdAt").notNullable().defaultTo(knex.fn.now());
    table.timestamp("updatedAt").notNullable().defaultTo(knex.fn.now());
    table.boolean("deleted").notNullable().defaultTo(false);

    // Constraints and indices
    table.primary(["id"]);
    table.foreign("projectId").references("projects.id").onDelete("CASCADE");
    table.foreign("mediaAssetId").references("mediaAssets.id").onDelete("CASCADE");
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTable("projectMediaAssets");
}
