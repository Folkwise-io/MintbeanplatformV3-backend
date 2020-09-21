import * as Knex from "knex";

export async function seed(knex: Knex): Promise<void> {
  await knex("mediaAssets").del();

  await knex("mediaAssets").insert([
    {
      id: "00000000-0000-0000-0000-000000000000",
      userId: "00000000-0000-0000-0000-000000000000",
      cloudinaryPublicId: "rtcx50vsggqq9wjvhob6",
      index: 0,
      createdAt: "2020-08-15T12:00:00.000Z",
      updatedAt: "2020-08-15T12:00:00.000Z",
    },
    {
      id: "00000000-0000-4000-a000-000000000000",
      userId: "00000000-0000-0000-0000-000000000000",
      cloudinaryPublicId: "jia7kqinylpoy96gzftg",
      index: 1,
      createdAt: "2020-09-15T12:00:00.000Z",
      updatedAt: "2020-09-15T12:00:00.000Z",
    },
    {
      id: "00000000-0000-4000-a000-000000000001",
      userId: "00000000-0000-4000-a000-000000000000",
      cloudinaryPublicId: "wzk5axcfxliedyrblkdj",
      createdAt: "2020-10-15T12:00:00.000Z",
      updatedAt: "2020-10-15T12:00:00.000Z",
    },
  ]);
}
