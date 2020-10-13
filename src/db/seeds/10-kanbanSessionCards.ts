import * as Knex from "knex";

export async function seed(knex: Knex): Promise<void> {
  await knex("kanbanSessionCards").del();

  await knex("kanbanSessionCards").insert([
    // kanban session on meet
    {
      id: "00000000-0000-0000-0000-000000000000",
      kanbanSessionId: "00000000-0000-0000-0000-000000000000",
      kanbanCardId: "00000000-0000-0000-0000-000000000000",
      index: 0,
      status: "WIP",
      createdAt: "2020-10-15",
    },
    {
      id: "00000000-0000-4000-a000-000000000000",
      kanbanSessionId: "00000000-0000-0000-0000-000000000000",
      kanbanCardId: "00000000-0000-4000-a000-000000000000",
      index: 0,
      status: "TODO",
      createdAt: "2020-10-15",
    },
    {
      id: "6d32252b-c85c-45d3-8f55-dd05d2e9cfd0",
      kanbanSessionId: "00000000-0000-0000-0000-000000000000",
      kanbanCardId: "6d32252b-c85c-45d3-8f55-dd05d2e9cfd0",
      index: 1,
      status: "TODO",
      createdAt: "2020-10-15",
    },
  ]);
}
