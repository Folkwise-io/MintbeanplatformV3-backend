import * as Knex from "knex";

export async function seed(knex: Knex): Promise<void> {
  await knex("users").del();

  await knex("users").insert([
    {
      id: "00000000-0000-0000-0000-000000000000",
      username: "aadams",
      first_name: "Amy",
      last_name: "Adams",
      created_at: "2019-10-15",
    },
    {
      id: "00000000-0000-0000-0000-000000000001",
      username: "bbarker",
      first_name: "Bob",
      last_name: "Barker",
      created_at: "2020-04-15",
    },
    {
      id: "00000000-0000-0000-0000-000000000002",
      username: "cchase",
      first_name: "Chevy",
      last_name: "Chase",
      created_at: "2020-08-15",
    },
  ]);
}
