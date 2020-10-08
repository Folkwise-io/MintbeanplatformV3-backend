import * as Knex from "knex";

export async function seed(knex: Knex): Promise<void> {
  await knex("kanbanCards").del();

  await knex("kanbanCards").insert([
    {
      id: "00000000-0000-0000-0000-000000000000",
      kanbanId: "00000000-0000-0000-0000-000000000000",
      index: 0,
      title: "Step 1",
      body: "This is the **first** thing to do",
      createdAt: "2020-10-15",
    },
    {
      id: "00000000-0000-4000-a000-000000000000",
      kanbanId: "00000000-0000-0000-0000-000000000000",
      index: 1,
      title: "Step 2",
      body: "This is the **second** thing to do",
      createdAt: "2020-10-15",
    },
    {
      id: "6d32252b-c85c-45d3-8f55-dd05d2e9cfd0",
      kanbanId: "00000000-0000-0000-0000-000000000000",
      index: 2,
      title: "Step 3",
      body: "This is the **third** thing to do",
      createdAt: "2020-10-15",
    },
  ]);
}
