import * as Knex from "knex";

export async function seed(knex: Knex): Promise<void> {
  await knex("projects").del();

  await knex("projects").insert([
    {
      id: "00000000-0000-0000-0000-000000000000",
      userId: "00000000-0000-0000-0000-000000000000",
      meetId: "00000000-0000-0000-0000-000000000000",
      title: "Amy's PaperJS Submission",
      sourceCodeUrl: "http://github.com",
      liveUrl: "http://google.com",
      createdAt: "2020-08-15T12:00:00.000Z",
      updatedAt: "2020-08-15T12:00:00.000Z",
    },
    {
      id: "00000000-0000-4000-a000-000000000000",
      userId: "00000000-0000-0000-0000-000000000000",
      meetId: "00000000-0000-4000-a000-000000000000",
      title: "Amy's Algolia Submission",
      sourceCodeUrl: "http://github.com",
      liveUrl: "http://google.com",
      createdAt: "2020-09-15T12:00:00.000Z",
      updatedAt: "2020-09-15T12:00:00.000Z",
    },
    {
      id: "00000000-0000-4000-a000-000000000001",
      userId: "00000000-0000-4000-a000-000000000000",
      meetId: "00000000-0000-0000-0000-000000000000",
      title: "Bob's PaperJS Submission",
      sourceCodeUrl: "http://github.com",
      liveUrl: "http://google.com",
      createdAt: "2020-10-15T12:00:00.000Z",
      updatedAt: "2020-10-15T12:00:00.000Z",
    },
  ]);
}
