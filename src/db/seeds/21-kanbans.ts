import * as Knex from "knex";

export async function seed(knex: Knex): Promise<void> {
  await knex("kanbanCanons").del();

  await knex("kanbanCanons").insert([
    {
      id: "00000000-0000-0000-0000-000000000000",
      title: "Animation Toys 1 Kanban",
      description: "Building impressive portfolio projects with PaperJS.",
      createdAt: "2020-10-15",
    },
    {
      id: "00000000-0000-4000-a000-000000000000",
      title: "Algolia gives you super powers 1 Kanban",
      description: "Building impressive portfolio projects with PaperJS.",
      createdAt: "2020-10-15",
    },
    {
      id: "6d32252b-c85c-45d3-8f55-dd05d2e9cfd0",
      title: "Hack the Hack Kanban",
      description: "Building impressive portfolio projects with PaperJS.",
      createdAt: "2020-10-15",
    },
  ]);
}
