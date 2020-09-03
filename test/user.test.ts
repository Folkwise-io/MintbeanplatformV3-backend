import TestManager from "./src/TestManager";
import { gql } from "apollo-server-express";
import { knex } from "../src/db/knex";

const GET_ALL_USERS = gql`
  query getAllUsers {
    users {
      firstName
      lastName
    }
  }
`;

const amy = {
  id: "00000000-0000-0000-0000-000000000000",
  username: "aadams",
  firstName: "Amy",
  lastName: "Adams",
  createdAt: "2019-10-15",
};

const bob = {
  id: "00000000-0000-4000-A000-000000000000",
  username: "bbarker",
  firstName: "Bob",
  lastName: "Barker",
  createdAt: "2020-04-15",
};

let testManager: TestManager;

beforeEach(() => {
  testManager = TestManager.build();
});

describe("Querying users", () => {
  it("gets all the users", async () => {
    await testManager
      .addUsers(amy, bob)
      .query({ query: GET_ALL_USERS })
      .then(testManager.getData)
      .then(({ users }) => {
        expect(users).toHaveLength(2);
        expect([amy, bob]).toMatchObject(users);
      });
  });
});

afterAll(async () => {
  await knex.destroy();
});
