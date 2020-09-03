import TestManager from "./src/TestManager";
import { gql } from "apollo-server-express";
import { knex } from "../src/db/knex";

const AMY = {
  id: "00000000-0000-0000-0000-000000000000",
  username: "aadams",
  firstName: "Amy",
  lastName: "Adams",
  createdAt: "2019-10-15",
};

const BOB = {
  id: "00000000-0000-4000-A000-000000000000",
  username: "bbarker",
  firstName: "Bob",
  lastName: "Barker",
  createdAt: "2020-04-15",
};

const GET_AMY = gql`
  query getOneUser {
    user (id: "00000000-0000-4000-A000-000000000000") {
      firstName
      lastName
    }
  }
`;

const GET_ALL_USERS = gql`
  query getAllUsers {
    users {
      firstName
      lastName
    }
  }
`;

let testManager: TestManager;

beforeEach(() => {
  testManager = TestManager.build();
});

describe("Querying users", () => {
  it("gets one user", async () => {
    await testManager
      .addUsers(AMY, BOB)
      .query({ query: GET_AMY })
      .then(testManager.getData)
      .then(({ user }) => {
        expect(AMY).toMatchObject(user);
      });
  });

  it("gets all the users", async () => {
    await testManager
      .addUsers(AMY, BOB)
      .query({ query: GET_ALL_USERS })
      .then(testManager.getData)
      .then(({ users }) => {
        expect(users).toHaveLength(2);
        expect([AMY, BOB]).toMatchObject(users);
      });
  });
});

afterAll(async () => {
  await knex.destroy();
});
