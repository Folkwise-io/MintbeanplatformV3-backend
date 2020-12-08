import * as Knex from "knex";

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable("scheduledEmails", (table) => {
    table.uuid("id").notNullable().defaultTo(knex.raw("uuid_generate_v4()")).unique();
    table.text("templateName").notNullable();
    table.uuid("userRecipientId"); // This will later be converted to a jsonb array field "userRecipientIds" when a use case for multiple user recipients arises
    table.jsonb("meetRecipientIds");
    table.uuid("meetId");
    table.timestamp("sendAt").notNullable().defaultTo(knex.fn.now());
    table.boolean("sent").notNullable().defaultTo(false);
    table.timestamp("createdAt").notNullable().defaultTo(knex.fn.now());
    table.timestamp("updatedAt").notNullable().defaultTo(knex.fn.now());

    // Constraints and indices
    table.primary(["id"]);
    table.foreign("userRecipientId").references("users.id").onDelete("CASCADE");
    table.foreign("meetId").references("meets.id").onDelete("CASCADE");
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTable("scheduledEmails");
}