import * as Knex from "knex";

export async function seed(knex: Knex): Promise<void> {
  await knex("meetRegistrations").del();

  await knex("meetRegistrations").insert([
    {
      userId: "00000000-0000-0000-0000-000000000000",
      meetId: "00000000-0000-0000-0000-000000000000",
    },
    {
      userId: "00000000-0000-0000-0000-000000000000",
      meetId: "00000000-0000-4000-a000-000000000000",
    },
    {
      userId: "00000000-0000-0000-0000-000000000000",
      meetId: "6d32252b-c85c-45d3-8f55-dd05d2e9cfd0",
    },
    {
      userId: "00000000-0000-0000-0000-000000000000",
      meetId: "87496d2d-ae36-4039-bd14-45bd0de3929c",
    },
    {
      userId: "00000000-0000-4000-a000-000000000000",
      meetId: "87496d2d-ae36-4039-bd14-45bd0de3929c",
    },
  ]);
}
