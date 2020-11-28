import * as Knex from "knex";

export async function seed(knex: Knex): Promise<void> {
  await knex("kanbanCanons").del();

  await knex("kanbanCanons").insert([
    {
      id: "00000000-0000-0000-0000-000000000000",
      title: "Animation Toys 1 Kanban",
      description: "Building impressive portfolio projects with PaperJS.",
      cardPositions: {
        todo: [
          "00000000-0000-0000-0000-000000000000",
          "00000000-0000-4000-a000-000000000000",
          "6d32252b-c85c-45d3-8f55-dd05d2e9cfd0",
        ],
        wip: [],
        done: [],
      },
      createdAt: "2020-08-15T12:00:00.000Z",
    },
    {
      id: "00000000-0000-4000-a000-000000000000",
      title: "Algolia gives you super powers 1 Kanban",
      description: "Building impressive portfolio projects with PaperJS.",
      cardPositions: {
        todo: [
          "f799815e-7273-4ade-bd3a-025f487dfc21",
          "4fa8b553-d80d-4e6e-98f7-2179c1d956a5",
          "80740d79-d7ce-40bc-82d5-87dd74e4d1e1",
        ],
        wip: [],
        done: [],
      },
      createdAt: "2020-08-15T12:00:00.000Z",
    },
    {
      id: "6d32252b-c85c-45d3-8f55-dd05d2e9cfd0",
      title: "Hack the Hack Kanban",
      description: "Building impressive portfolio projects with PaperJS.",
      createdAt: "2020-08-15T12:00:00.000Z",
    },
  ]);
}
