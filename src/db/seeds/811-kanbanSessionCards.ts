import * as Knex from "knex";

export async function seed(knex: Knex): Promise<void> {
  await knex("kanbanSessionCards").del();

  await knex("kanbanSessionCards").insert([
    // Bob's kanban view of Animation Toys 1 Kanban
    {
      // id: "00000000-0000-0000-0000-000000000000",
      kanbanSessionId: "00000000-0000-0000-0000-000000000000",
      kanbanCanonCardId: "00000000-0000-0000-0000-000000000000",
      // status: "WIP",
    },
    {
      // id: "00000000-0000-4000-a000-000000000000",
      kanbanSessionId: "00000000-0000-0000-0000-000000000000",
      kanbanCanonCardId: "00000000-0000-4000-a000-000000000000",
    },
    {
      // id: "6d32252b-c85c-45d3-8f55-dd05d2e9cfd0",
      kanbanSessionId: "00000000-0000-0000-0000-000000000000",
      kanbanCanonCardId: "6d32252b-c85c-45d3-8f55-dd05d2e9cfd0",
    },

    {
      // id: "b9e1050d-fa9b-461b-a4c7-64501ffd3db6",
      kanbanSessionId: "00000000-0000-4000-a000-000000000000",
      kanbanCanonCardId: "f799815e-7273-4ade-bd3a-025f487dfc21",
      // status: "WIP",
    },
  ]);
}
