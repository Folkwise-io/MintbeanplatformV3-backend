import * as Knex from "knex";

export async function seed(knex: Knex): Promise<void> {
  await knex("users").del();

  await knex("users").insert([
    {
      id: "00000000-0000-0000-0000-000000000000",
      username: "aadams",
      email: "a@a.com",
      firstName: "Amy",
      lastName: "Adams",
      passwordHash: "$2a$10$FB/BOAVhpuLvpOREQVmvmezD4ED/.JBIDRh70tGevYzYzQgFId2u.",
      createdAt: "2019-10-15",
    },
    {
      id: "00000000-0000-4000-a000-000000000000",
      username: "bbarker",
      email: "b@b.com",
      firstName: "Bob",
      lastName: "Barker",
      passwordHash: "$2a$10$FB/BOAVhpuLvpOREQVmvmezD4ED/.JBIDRh70tGevYzYzQgFId2u.",
      createdAt: "2020-04-15",
    },
    {
      id: "00000000-0000-4000-b000-000000000000",
      username: "cchase",
      email: "c@c.com",
      firstName: "Chevy",
      lastName: "Chase",
      passwordHash: "$2a$10$FB/BOAVhpuLvpOREQVmvmezD4ED/.JBIDRh70tGevYzYzQgFId2u.",
      createdAt: "2020-08-15",
    },
  ]);
}
