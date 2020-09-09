import * as Knex from "knex";

export async function seed(knex: Knex): Promise<void> {
  await knex("users").del();

  await knex("users").insert([
    {
      id: "00000000-0000-0000-0000-000000000000",
      username: "aadams",
      firstName: "Amy",
      lastName: "Adams",
      passwordHash: "$2a$10$FB/BOAVhpuLvpOREQVmvmezD4ED/.JBIDRh70tGevYzYzQgFId2u.",
      createdAt: "2019-10-15",
    },
    {
      id: "00000000-0000-4000-A000-000000000000",
      username: "bbarker",
      firstName: "Bob",
      lastName: "Barker",
      passwordHash: "$2a$10$FB/BOAVhpuLvpOREQVmvmezD4ED/.JBIDRh70tGevYzYzQgFId2u.",
      createdAt: "2020-04-15",
    },
    {
      id: "00000000-0000-4000-B000-000000000000",
      username: "cchase",
      firstName: "Chevy",
      lastName: "Chase",
      passwordHash: "$2a$10$FB/BOAVhpuLvpOREQVmvmezD4ED/.JBIDRh70tGevYzYzQgFId2u.",
      createdAt: "2020-08-15",
    },
  ]);
}
