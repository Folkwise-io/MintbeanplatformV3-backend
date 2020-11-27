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
      updatedAt: "2020-08-15T12:00:00.000Z",
    },
    {
      id: "00000000-0000-4000-a000-000000000000",
      kanbanCanonId: "00000000-0000-0000-0000-000000000000", // Animation Toys 1 Kanban
      title: "Kanban Card 2",
      body: "This is the **second** thing to do",
      createdAt: "2020-08-15T12:00:00.000Z",
      updatedAt: "2020-08-15T12:00:00.000Z",
    },
    {
      id: "6d32252b-c85c-45d3-8f55-dd05d2e9cfd0",
      kanbanCanonId: "00000000-0000-0000-0000-000000000000", // Animation Toys 1 Kanban
      title: "Kanban Card 3",
      body: "This is the **third** thing to do",
      createdAt: "2020-08-15T12:00:00.000Z",
      updatedAt: "2020-08-15T12:00:00.000Z",
    },
    {
      id: "f799815e-7273-4ade-bd3a-025f487dfc21",
      kanbanCanonId: "00000000-0000-4000-a000-000000000000", // Algolia give you super powers 1 Kanban
      title: "Kanban Card 1",
      body: "This is the **first** thing to do",
      createdAt: "2020-08-15T12:00:00.000Z",
      updatedAt: "2020-08-15T12:00:00.000Z",
    },
    {
      id: "4fa8b553-d80d-4e6e-98f7-2179c1d956a5",
      kanbanCanonId: "00000000-0000-4000-a000-000000000000", // Algolia give you super powers 1 Kanban
      title: "Kanban Card 2",
      body: "This is the **second** thing to do",
      createdAt: "2020-08-15T12:00:00.000Z",
      updatedAt: "2020-08-15T12:00:00.000Z",
    },
    {
      id: "80740d79-d7ce-40bc-82d5-87dd74e4d1e1",
      kanbanCanonId: "00000000-0000-4000-a000-000000000000", // Algolia give you super powers 1 Kanban
      title: "Kanban Card 3",
      body: "This is the **third** thing to do",
      createdAt: "2020-08-15T12:00:00.000Z",
      updatedAt: "2020-08-15T12:00:00.000Z",
    },
  ]);
}
