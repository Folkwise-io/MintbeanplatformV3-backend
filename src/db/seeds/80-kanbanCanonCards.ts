import * as Knex from "knex";

export async function seed(knex: Knex): Promise<void> {
  await knex("kanbanCanonCards").del();

  await knex("kanbanCanonCards").insert([
    {
      id: "00000000-0000-0000-0000-000000000000",
      kanbanCanonId: "00000000-0000-0000-0000-000000000000", // Animation Toys 1 Kanban
      title: "Kanban Card 1",
      body: "This is the **first** thing to do",
      createdAt: "2020-08-15T12:00:00.000Z",
    },
    {
      id: "00000000-0000-4000-a000-000000000000",
      kanbanCanonId: "00000000-0000-0000-0000-000000000000", // Animation Toys 1 Kanban
      title: "Kanban Card 2",
      body: "This is the **second** thing to do",
      createdAt: "2020-08-15T12:00:00.000Z",
    },
    {
      id: "6d32252b-c85c-45d3-8f55-dd05d2e9cfd0",
      kanbanCanonId: "00000000-0000-0000-0000-000000000000", // Animation Toys 1 Kanban
      title: "Kanban Card 3",
      body: "This is the **third** thing to do",
      createdAt: "2020-08-15T12:00:00.000Z",
    },
  ]);
}
