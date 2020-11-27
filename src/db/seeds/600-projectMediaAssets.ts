import * as Knex from "knex";

export async function seed(knex: Knex): Promise<void> {
  await knex("projectMediaAssets").del();

  await knex("projectMediaAssets").insert([
    {
      projectId: "00000000-0000-0000-0000-000000000000",
      mediaAssetId: "00000000-0000-0000-0000-000000000000",
    },
    {
      projectId: "00000000-0000-0000-0000-000000000000",
      mediaAssetId: "00000000-0001-0000-0000-000000000000",
    },
    {
      projectId: "00000000-0000-0000-0000-000000000000",
      mediaAssetId: "00000000-0002-0000-0000-000000000000",
    },
    {
      projectId: "00000000-0000-0000-0000-000000000000",
      mediaAssetId: "00000000-0000-4000-a000-000000000000",
    },
    {
      projectId: "00000000-0000-4000-a000-000000000000",
      mediaAssetId: "00000000-0000-4000-a000-000000000001",
    },
  ]);
}
