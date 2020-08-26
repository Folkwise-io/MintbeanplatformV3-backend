import * as Knex from "knex";

export async function seed(knex: Knex): Promise<void> {
  await knex("users").del();

  await knex("users").insert([
    {
      id: "00000000-0000-0000-0000-000000000000",
      username: "aadams",
      firstName: "Amy",
      lastName: "Adams",
      createdAt: "2019-10-15",
    },
    {
      id: "00000000-0000-0000-0000-000000000001",
      username: "bbarker",
      firstName: "Bob",
      lastName: "Barker",
      createdAt: "2020-04-15",
    },
    {
      id: "00000000-0000-0000-0000-000000000002",
      username: "cchase",
      firstName: "Chevy",
      lastName: "Chase",
      createdAt: "2020-08-15",
    },
  ]);
}
