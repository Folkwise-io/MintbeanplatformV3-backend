import * as Knex from "knex";

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable("scheduledEmails", (table) => {
    table.uuid("id").notNullable().defaultTo(knex.raw("uuid_generate_v4()")).unique();
    table.text("templateName").notNullable();
    table.uuid("userId");
    table.uuid("meetId");
    table.text("html");
    table.timestamp("sendAt").notNullable().defaultTo(knex.fn.now());
    table.boolean("sent").notNullable().defaultTo(false);
    table.timestamp("createdAt").notNullable().defaultTo(knex.fn.now());

    // Constraints and indices
    table.primary(["id"]);
    table.foreign("userId").references("users.id").onDelete("SET NULL");
    table.foreign("meetId").references("meets.id").onDelete("SET NULL");
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTable("scheduledEmails");
}
