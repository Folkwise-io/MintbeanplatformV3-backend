import TestManager from "./src/TestManager";
import { gql } from "apollo-server-express";

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

const BAD_USER_ID_QUERY = gql`
  query badUserId {
    user(id: "000000") {
      firstName
      lastName
    }
  }
`;

const GET_AMY_QUERY = gql`
  query getOneUser {
    user(id: "00000000-0000-0000-0000-000000000000") {
      firstName
      lastName
    }
  }
`;

const GET_ALL_USERS_QUERY = gql`
  query getAllUsers {
    users {
      firstName
      lastName
    }
  }
`;

const testManager = TestManager.build();

beforeEach(async () => {
  await testManager.deleteAllUsers();
});

describe("GraphQL built-in validation", () => {
  it("throws an error when you pass in an ID that is not a UUID", async () => {
    await testManager
      .addUsers([AMY, BOB])
      .then(() => testManager.query({ query: BAD_USER_ID_QUERY }))
      .then(testManager.getErrors)
      .then((errors) => {
        expect(errors[0].message).toContain("UUID");
      });
  });
});

describe("Querying users", () => {
  it("gets one user by ID", async () => {
    await testManager
      .addUsers([AMY, BOB])
      .then(() => testManager.query({ query: GET_AMY_QUERY }))
      .then(testManager.getData)
      .then(({ user }) => {
        expect(AMY).toMatchObject(user);
      });
  });

  it("gets all the users", async () => {
    await testManager
      .addUsers([AMY, BOB])
      .then(() => testManager.query({ query: GET_ALL_USERS_QUERY }))
      .then(testManager.getData)
      .then(({ users }) => {
        expect(users).toHaveLength(2);
        expect([AMY, BOB]).toMatchObject(users);
      });
  });
});

afterAll(async () => {
  await testManager.destroy();
});
