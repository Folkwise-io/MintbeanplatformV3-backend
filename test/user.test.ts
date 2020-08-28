import TestManager from "./src/TestManager";
import { gql } from "apollo-server-express";
import { knex } from "../src/db/knex";

const testManager = new TestManager();

describe("Querying users", () => {
  it("does something", async () => {
    const GET_ALL_USERS = gql`
      query getAllUsers {
        users {
          firstName
        }
      }
    `;
    const result = await testManager.query({ query: GET_ALL_USERS });
    console.log(JSON.stringify(result.data, null, 2));
  });
});

afterAll(async () => {
  await knex.destroy();
});
