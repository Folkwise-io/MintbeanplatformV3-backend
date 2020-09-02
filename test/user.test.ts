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

let testManager: TestManager;
describe("Querying users", () => {
  beforeEach(() => {
    testManager = TestManager.build();
  });

  it("gets all users", async () => {
    await testManager
      .addUsers({ id: "blah", firstName: "Joe" })
      .query({ query: GET_ALL_USERS })
      .then((response) => {
        expect(JSON.stringify(response)).toContain("Joe");
      });
  });
});

afterAll(async () => {
  await knex.destroy();
});
