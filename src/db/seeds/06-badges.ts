import * as Knex from "knex";

export async function seed(knex: Knex): Promise<void> {
  // Deletes ALL existing entries
  await knex("badges").del();

  // Inserts seed entries
  await knex("badges").insert([
    {
      id: "00000000-0000-0000-0000-000000000000",
      alias: ":winner-first:",
      badgeShape: "star",
      title: "Winner - 1st place",
      description: "",
      weight: 1000,
    },
    {
      id: "00000000-0000-4000-a000-000000000000",
      alias: ":winner-second:",
      badgeShape: "square",
      title: "2nd place",
      description: "",
      weight: 750,
    },
    {
      id: "00000000-0000-4000-a000-000000000001",
      alias: ":winner-third:",
      badgeShape: "circle",
      title: "3rd place",
      description: "",
      weight: 500,
    },
  ]);
}
