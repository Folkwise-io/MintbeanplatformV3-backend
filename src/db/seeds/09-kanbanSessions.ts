import * as Knex from "knex";

export async function seed(knex: Knex): Promise<void> {
  await knex("kanbanSessions").del();

  await knex("kanbanSessions").insert([
    // kanban session on meet
    {
      id: "00000000-0000-0000-0000-000000000000",
      // Animation Toys 1 Kanban
      kanbanId: "00000000-0000-0000-0000-000000000000",
      // Bob
      userId: "00000000-0000-4000-a000-000000000000",
      // Animation Toys 1
      meetId: "00000000-0000-0000-0000-000000000000",
      createdAt: "2020-10-15",
    },
    // kanban session independent of meet
    {
      id: "00000000-0000-4000-a000-000000000000",
      // Hack the Hack Kanban
      kanbanId: "6d32252b-c85c-45d3-8f55-dd05d2e9cfd0",
      // Bob
      userId: "00000000-0000-4000-a000-000000000000",
      // no meet
      meetId: null,
      createdAt: "2020-10-15",
    },
  ]);
}
