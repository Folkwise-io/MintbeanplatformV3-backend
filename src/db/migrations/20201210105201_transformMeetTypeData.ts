import * as Knex from "knex";

export async function up(knex: Knex): Promise<void> {
  await knex
    .raw(
      `
        UPDATE "meets" 
        SET "meetType" = 'HACKATHON' 
        WHERE "meetType" = 'hackMeet';
      `,
    )
    .then((res) => res);
}

export async function down(knex: Knex): Promise<void> {
  await knex
    .raw(
      `
        UPDATE "meets" 
        SET "meetType" = 'hackMeet' 
        WHERE "meetType" = 'HACKATHON';
      `,
    )
    .then((res) => res);
}
