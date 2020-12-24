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
    /* For JS GameHacks: Build Your Own Virtual Board Game */
    {
      userId: "00000000-0000-4000-a000-000000000000",
      meetId: "e6c1a3b7-5f53-45db-9679-9883d30d6484",
    },
    {
      userId: "00000000-0000-0000-0000-000000000000",
      meetId: "e6c1a3b7-5f53-45db-9679-9883d30d6484",
    },
    {
      userId: "00000000-0000-4000-b000-000000000000",
      meetId: "e6c1a3b7-5f53-45db-9679-9883d30d6484",
    },
    {
      userId: "65cf0c36-3d8a-4f48-b835-bad10edbdb64",
      meetId: "e6c1a3b7-5f53-45db-9679-9883d30d6484",
    },
    {
      userId: "1970d7de-a08c-4f36-b461-f9351cbec8b4",
      meetId: "e6c1a3b7-5f53-45db-9679-9883d30d6484",
    },
    {
      userId: "8958cb5e-4491-434e-b8eb-ca04077a0718",
      meetId: "e6c1a3b7-5f53-45db-9679-9883d30d6484",
    },
    {
      userId: "f7390f83-d84e-4bdd-b032-9726024cc6aa",
      meetId: "e6c1a3b7-5f53-45db-9679-9883d30d6484",
    },
  ]);
}
