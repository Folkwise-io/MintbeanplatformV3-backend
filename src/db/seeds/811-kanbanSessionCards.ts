import * as Knex from "knex";

export async function seed(knex: Knex): Promise<void> {
  await knex("kanbanSessionCards").del();

  await knex("kanbanSessionCards").insert([
    // Bob's kanban view of Animation Toys 1 Kanban
    {
      id: "00000000-0000-0000-0000-000000000000",
      kanbanSessionId: "00000000-0000-0000-0000-000000000000",
      kanbanCanonCardId: "00000000-0000-0000-0000-000000000000",
      status: "WIP",
    },
    {
      id: "00000000-0000-4000-a000-000000000000",
      kanbanSessionId: "00000000-0000-0000-0000-000000000000",
      kanbanCanonCardId: "00000000-0000-4000-a000-000000000000",
    },
    {
      id: "6d32252b-c85c-45d3-8f55-dd05d2e9cfd0",
      kanbanSessionId: "00000000-0000-0000-0000-000000000000",
      kanbanCanonCardId: "6d32252b-c85c-45d3-8f55-dd05d2e9cfd0",
    },
  ]);
}
