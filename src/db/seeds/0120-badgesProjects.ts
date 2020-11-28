import * as Knex from "knex";

export async function seed(knex: Knex): Promise<void> {
  await knex("badgesProjects").del();

  await knex("badgesProjects").insert([
    {
      projectId: "00000000-0000-0000-0000-000000000000",
      badgeId: "00000000-0000-0000-0000-000000000000",
    },
    {
      projectId: "00000000-0000-4000-a000-000000000001",
      badgeId: "00000000-0000-4000-a000-000000000000",
    },
    {
      projectId: "00000000-0000-4000-a000-000000000000",
      badgeId: "00000000-0000-4000-a000-000000000001",
    },
  ]);
}
