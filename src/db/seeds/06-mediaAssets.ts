import * as Knex from "knex";

export async function seed(knex: Knex): Promise<void> {
  await knex("mediaAssets").del();

  await knex("mediaAssets").insert([
    {
      id: "00000000-0000-0000-0000-000000000000",
      userId: "00000000-0000-0000-0000-000000000000",
      cloudinaryPublicId: "svlhuam8szcexgira7pi",
      index: 0,
      createdAt: "2020-08-15T12:00:00.000Z",
      updatedAt: "2020-08-15T12:00:00.000Z",
    },
    {
      id: "00000000-0001-0000-0000-000000000000",
      userId: "00000000-0000-0000-0000-000000000000",
      cloudinaryPublicId: "zkg8w8xjrbnwga3mebvg",
      index: 0,
      createdAt: "2020-08-15T12:00:00.000Z",
      updatedAt: "2020-08-15T12:00:00.000Z",
    },
    {
      id: "00000000-0002-0000-0000-000000000000",
      userId: "00000000-0000-0000-0000-000000000000",
      cloudinaryPublicId: "hdxeixhoshuq0o2xveo9",
      index: 0,
      createdAt: "2020-08-15T12:00:00.000Z",
      updatedAt: "2020-08-15T12:00:00.000Z",
    },
    {
      id: "00000000-0000-4000-a000-000000000000",
      userId: "00000000-0000-0000-0000-000000000000",
      cloudinaryPublicId: "kwqmjvbansn2eixjvuk8",
      index: 1,
      createdAt: "2020-09-15T12:00:00.000Z",
      updatedAt: "2020-09-15T12:00:00.000Z",
    },
    {
      id: "00000000-0000-4000-a000-000000000001",
      userId: "00000000-0000-4000-a000-000000000000",
      cloudinaryPublicId: "wkt8w5yvybzklno2v2cc",
      createdAt: "2020-10-15T12:00:00.000Z",
      updatedAt: "2020-10-15T12:00:00.000Z",
    },
  ]);
}
