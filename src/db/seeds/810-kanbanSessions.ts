import * as Knex from "knex";

export async function seed(knex: Knex): Promise<void> {
  await knex("kanbanSessions").del();

  await knex("kanbanSessions").insert([
    // Meet kanbanSession
    {
      id: "00000000-0000-0000-0000-000000000000",
      kanbanCanonId: "00000000-0000-0000-0000-000000000000", // Animation Toys 1 Kanban
      userId: "00000000-0000-4000-a000-000000000000", // Bob
      meetId: "00000000-0000-0000-0000-000000000000", //  Animation Toys 1
      createdAt: "2020-08-15T12:00:00.000Z",
      updatedAt: "2020-08-15T12:00:00.000Z",
    },
    // Isolated kanbanSession
    {
      id: "00000000-0000-4000-a000-000000000000",
      kanbanCanonId: "00000000-0000-4000-a000-000000000000", // Algolia gives you super powers 1 Kanban
      userId: "00000000-0000-4000-a000-000000000000", // Bob
      createdAt: "2020-08-15T12:00:00.000Z",
      updatedAt: "2020-08-15T12:00:00.000Z",
    },
  ]);
}
