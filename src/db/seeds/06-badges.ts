import * as Knex from "knex";

export async function seed(knex: Knex): Promise<void> {
  // Deletes ALL existing entries
  await knex("badges").del();

  // Inserts seed entries
  await knex("badges").insert([
    {
      alias: ":winner-first:",
      badgeShape: "star",
      faIcon: "trophy",
      title: "Winner - 1st place",
      description: "",
      weight: 1000,
    },
    {
      alias: ":winner-second:",
      badgeShape: "square",
      faIcon: "medal",
      title: "2nd place",
      description: "",
      weight: 750,
    },
    {
      alias: ":winner-third:",
      badgeShape: "circle",
      faIcon: "award",
      title: "3rd place",
      description: "",
      weight: 500,
    },
  ]);
}
