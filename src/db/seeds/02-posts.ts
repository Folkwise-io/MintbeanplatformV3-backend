import * as Knex from "knex";

export async function seed(knex: Knex): Promise<void> {
  await knex("posts").del();

  await knex("posts").insert([
    {
      user_id: "00000000-0000-0000-0000-000000000000",
      body: "Post 1",
      created_at: "2019-08-15",
    },
    {
      user_id: "00000000-0000-0000-0000-000000000000",
      body: "Post 2",
      created_at: "2019-02-15",
    },
    {
      user_id: "00000000-0000-0000-0000-000000000001",
      body: "Post 3",
      created_at: "2020-08-15",
    },
  ]);
}
