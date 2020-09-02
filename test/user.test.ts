import TestManager from "./src/TestManager";
import { gql } from "apollo-server-express";
import { knex } from "../src/db/knex";

const GET_ALL_USERS = gql`
  query getAllUsers {
    users {
      firstName
    }
  }
`;

let testManager;
describe("Querying users", () => {
  beforeEach(() => {
    const state = {
      users: [],
    };
    testManager = TestManager.build(state);
  });

  it("gets all users", async () => {
    await testManager.printQueryResults({ query: GET_ALL_USERS });
  });
});

afterAll(async () => {
  await knex.destroy();
});
