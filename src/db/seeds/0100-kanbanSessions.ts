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
      cardPositions: {
        todo: ["00000000-0000-4000-a000-000000000000", "6d32252b-c85c-45d3-8f55-dd05d2e9cfd0"],
        wip: ["00000000-0000-0000-0000-000000000000"],
      },
      createdAt: "2020-08-15T12:00:00.000Z",
      updatedAt: "2020-08-15T12:00:00.000Z",
    },
    // Isolated kanbanSession
    {
      id: "00000000-0000-4000-a000-000000000000",
      kanbanCanonId: "00000000-0000-4000-a000-000000000000", // Algolia gives you super powers 1 Kanban
      userId: "00000000-0000-4000-a000-000000000000", // Bob
      cardPositions: {
        wip: ["f799815e-7273-4ade-bd3a-025f487dfc21"],
      },
      createdAt: "2020-08-15T12:00:00.000Z",
      updatedAt: "2020-08-15T12:00:00.000Z",
    },
  ]);
}
