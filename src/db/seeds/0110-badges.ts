import * as Knex from "knex";

export async function seed(knex: Knex): Promise<void> {
  // Deletes ALL existing entries
  await knex("badges").del();

  // Inserts seed entries
  await knex("badges").insert([
    {
      id: "00000000-0000-4000-a000-000000000001",
      alias: ":winner-third:",
      badgeShape: "circle",
      faIcon: "award",
      backgroundHex: "fb8a13",
      iconHex: "b418cb",
      title: "3rd place",
      description: "",
      weight: 500,
    },
    {
      id: "00000000-0000-0000-0000-000000000000",
      alias: ":winner-first:",
      badgeShape: "star",
      faIcon: "trophy",
      backgroundHex: "000000",
      iconHex: "f9ce13",
      title: "Winner - 1st place",
      description: "",
      weight: 1000,
    },
    {
      id: "00000000-0000-4000-a000-000000000000",
      alias: ":winner-second:",
      badgeShape: "square",
      faIcon: "medal",
      backgroundHex: "2bf0e5",
      iconHex: "f26d35",
      title: "2nd place",
      description: "This is the second place badge awarded to an exceptional hackathon entry!",
      weight: 750,
    },
  ]);
}
