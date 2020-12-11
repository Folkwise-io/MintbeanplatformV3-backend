import * as Knex from "knex";

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable("scheduledEmails", (table) => {
    table.uuid("id").notNullable().defaultTo(knex.raw("uuid_generate_v4()")).unique();
    table.text("templateName").notNullable(); // for now
    table.uuid("userRecipientId");
    table.uuid("meetRecipientId");
    table.uuid("meetId");
    table.timestamp("sendAt").notNullable().defaultTo(knex.fn.now());
    table.timestamp("createdAt").notNullable().defaultTo(knex.fn.now());
    table.timestamp("updatedAt").notNullable().defaultTo(knex.fn.now());

    // Constraints and indicesyarn p
    table.primary(["id"]);
    table.foreign("userRecipientId").references("users.id").onDelete("CASCADE");
    table.foreign("meetRecipientId").references("meets.id").onDelete("CASCADE");
    table.foreign("meetId").references("meets.id").onDelete("CASCADE");
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTable("scheduledEmails");
}
