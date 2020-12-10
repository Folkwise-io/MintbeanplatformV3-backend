import * as Knex from "knex";

export async function up(knex: Knex): Promise<void> {
  await knex
    .raw(
      `
        UPDATE "badges" 
        SET "badgeShape" = 'CIRCLE' 
        WHERE "badgeShape" = 'circle';

        UPDATE "badges" 
        SET "badgeShape" = 'STAR' 
        WHERE "badgeShape" = 'star';

        UPDATE "badges" 
        SET "badgeShape" = 'SQUARE' 
        WHERE "badgeShape" = 'square';
      `,
    )
    .then((res) => res);
}

export async function down(knex: Knex): Promise<void> {
  await knex
    .raw(
      `
      UPDATE "badges" 
      SET "badgeShape" = 'circle' 
      WHERE "badgeShape" = 'CIRCLE';

      UPDATE "badges" 
      SET "badgeShape" = 'star' 
      WHERE "badgeShape" = 'STAR';
      
      UPDATE "badges" 
      SET "badgeShape" = 'square' 
      WHERE "badgeShape" = 'SQUARE';
    `,
    )
    .then((res) => res);
}
