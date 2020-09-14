import TestManager from "./src/TestManager";
import { gql } from "apollo-server-express";
import { User } from "../src/types/gqlGeneratedTypes";
import jwt from "jsonwebtoken";

import config from "../src/util/config";
import { ParsedToken } from "../src/util/jwtUtils";
const { jwtSecret } = config;

// Will use generator factory / faker once more entities are added
const AMY: User = {
  id: "00000000-0000-0000-0000-000000000000",
  username: "aadams",
  email: "a@a.com",
  passwordHash: "$2a$10$FB/BOAVhpuLvpOREQVmvmezD4ED/.JBIDRh70tGevYzYzQgFId2u.",
  firstName: "Amy",
  lastName: "Adams",
  createdAt: "2019-10-15",
};

const BOB: User = {
  id: "00000000-0000-4000-A000-000000000000",
  username: "bbarker",
  email: "b@b.com",
  passwordHash: "$2a$10$FB/BOAVhpuLvpOREQVmvmezD4ED/.JBIDRh70tGevYzYzQgFId2u.",
  firstName: "Bob",
  lastName: "Barker",
  createdAt: "2020-04-15",
};

const testManager = TestManager.build();

beforeEach(async () => {
  await testManager.deleteAllUsers();
});

describe("GraphQL built-in validation", () => {
  it("throws an error when you pass in a username that's not a string", async () => {
    const BAD_USERNAME_QUERY = gql`
      query badUserName {
        user(username: 5) {
          firstName
          lastName
        }
      }
    `;

    await testManager
      .query(BAD_USERNAME_QUERY)
      .then(testManager.getError)
      .then((error) => {
        expect(error.message).toContain("string");
      });
  });

  it("throws an error when you pass in an ID that is not a UUID", async () => {
    const BAD_UUID_QUERY = gql`
      query badUserId {
        user(id: "000000") {
          firstName
          lastName
        }
      }
    `;

    await testManager
      .query(BAD_UUID_QUERY)
      .then(testManager.getError)
      .then((error) => {
        expect(error.message).toContain("UUID");
      });
  });
});

describe("Querying users", () => {
  const GET_ONE_QUERY = gql`
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

  it("gets one user by ID", async () => {
    await testManager
      .addUsers([AMY, BOB])
      .then(() => testManager.query(GET_ONE_QUERY))
      .then(testManager.logResponse)
      .then(testManager.getData)
      .then(({ user }) => {
        expect(AMY).toMatchObject(user);
      });
  });

  it("gets all the users", async () => {
    await testManager
      .addUsers([AMY, BOB])
      .then(() => testManager.query(GET_ALL_USERS_QUERY))
      .then(testManager.getData)
      .then(({ users }) => {
        expect(users).toHaveLength(2);
        expect([AMY, BOB]).toMatchObject(users);
      });
  });

  it("gets no users when ID doesn't exist", async () => {
    await testManager
      .addUsers([])
      .then(() => testManager.query(GET_ONE_QUERY))
      .then(testManager.getDataAndErrors)
      .then(({ data, errors }) => {
        expect(data.user).toBeNull();
        expect(errors[0].message).toBe("User does not exist");
      });
  });
});

describe("Login", () => {
  beforeEach(async () => {
    await testManager.addUsers([AMY, BOB]);
  });

  const LOGIN_MUTATION_CORRECT = gql`
    mutation correctLogin {
      login(email: "a@a.com", password: "password") {
        id
        username
      }
    }
  `;

  it("sends back the user when given the email and the correct password", async () => {
    await testManager
      .query(LOGIN_MUTATION_CORRECT)
      .then(testManager.getData)
      .then(({ login }) => {
        expect(AMY).toMatchObject(login);
      });
  });

  it("sends back a valid JWT when given the email and the correct password", async () => {
    const LOGIN_MUTATION_WITH_TOKEN = gql`
      mutation correctLogin {
        login(email: "a@a.com", password: "password") {
          token
        }
      }
    `;
    await testManager
      .query(LOGIN_MUTATION_WITH_TOKEN)
      .then(testManager.getData)
      .then(({ login: { token } }) => {
        const parsedToken = jwt.verify(token, jwtSecret) as ParsedToken;
        expect(parsedToken.sub).toBe(AMY.id);

        const currentUnixTime = Math.floor(new Date().getTime() / 1000);
        expect(parsedToken.iat).toBeCloseTo(currentUnixTime);
        expect(parsedToken.exp - parsedToken.iat).toBeCloseTo(14 * 24 * 60 * 60); // 14 days

        expect(() => jwt.verify(token, "wrongsecret")).toThrowError();
      });
  });

  it("sends back an error if the password is wrong", async () => {
    const LOGIN_MUTATION_INCORRECT_PASSWORD = gql`
      mutation wrongPassword {
        login(email: "a@a.com", password: "wrongpassword") {
          id
          username
        }
      }
    `;

    await testManager
      .query(LOGIN_MUTATION_INCORRECT_PASSWORD)
      .then(testManager.getError)
      .then((error) => {
        expect(error.message).toMatch(/login failed/i);
      });
  });

  it("sends back an error if no password is provided", async () => {
    const LOGIN_MUTATION_NO_PASSWORD = gql`
      mutation noPassword {
        login(email: "a@a.com") {
          id
          username
        }
      }
    `;

    await testManager
      .query(LOGIN_MUTATION_NO_PASSWORD)
      .then(testManager.getError)
      .then((error) => {
        expect(error.message).toContain("password");
      });
  });

  it("sends back an error if no email is provided", async () => {
    const LOGIN_MUTATION_NO_EMAIL = gql`
      mutation noEmail {
        login(password: "password") {
          id
          username
        }
      }
    `;

    await testManager
      .query(LOGIN_MUTATION_NO_EMAIL)
      .then(testManager.getError)
      .then((error) => {
        expect(error.message).toContain("email");
      });
  });
});

afterAll(async () => {
  await testManager.destroy();
});
