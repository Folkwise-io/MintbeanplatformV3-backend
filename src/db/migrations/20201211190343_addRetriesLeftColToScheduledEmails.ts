import * as Knex from "knex";

export async function up(knex: Knex): Promise<void> {
  return knex.schema.table("scheduledEmails", function (t) {
    t.integer("retriesLeft").notNullable().defaultTo(3);
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.table("scheduledEmails", function (t) {
    t.dropColumn("retriesLeft");
  });
}
