import * as Knex from "knex";

export async function seed(knex: Knex): Promise<void> {
  // Deletes ALL existing entries
  await knex("badges").del();

  // Inserts seed entries
  await knex("badges").insert([
    {
      badgeId: "00000000-0000-0000-0000-000000000000",
      alias: ":winner-first:",
      badgeShape: "star",
      faIcon: "trophy",
      title: "Winner - 1st place",
      description: "",
      weight: 1000,
    },
    {
      badgeId: "00000000-0000-4000-a000-000000000000",
      alias: ":winner-second:",
      badgeShape: "square",
      faIcon: "medal",
      title: "2nd place",
      description: "",
      weight: 750,
    },
    {
      badgeId: "00000000-0000-4000-a000-000000000001",
      alias: ":winner-third:",
      badgeShape: "circle",
      faIcon: "award",
      title: "3rd place",
      description: "",
      weight: 500,
    },
  ]);
}
