import * as Knex from "knex";

export async function seed(knex: Knex): Promise<void> {
  // Deletes ALL existing entries
  await knex("users").del();

  // Inserts seed entries
  await knex("users").insert([
    {
      username: "aadams",
      first_name: "Amy",
      last_name: "Adams",
      created_at: "2019-10-15",
    },
    {
      username: "bbarker",
      first_name: "Bob",
      last_name: "Barker",
      created_at: "2020-04-15",
    },
    {
      username: "cchase",
      first_name: "Chevy",
      last_name: "Chase",
      created_at: "2020-08-15",
    },
  ]);
}
