import TestManager from "./src/TestManager";
import jwt from "jsonwebtoken";

import config from "../src/util/config";
import { ParsedToken } from "../src/util/jwtUtils";
import { getCurrentUnixTime } from "./src/util";
import {
  AMY,
  BAD_USERNAME_QUERY,
  BAD_UUID_QUERY,
  BOB,
  GET_ALL_USERS_QUERY,
  GET_ONE_QUERY,
  LOGIN_MUTATION_CORRECT,
  LOGIN_MUTATION_INCORRECT_PASSWORD,
  LOGIN_MUTATION_NO_EMAIL,
  LOGIN_MUTATION_NO_PASSWORD,
  LOGIN_MUTATION_WITH_TOKEN,
  LOGOUT,
  ME_QUERY,
} from "./src/userConstants";
const { jwtSecret } = config;

const testManager = TestManager.build();

beforeEach(async () => {
  await testManager.deleteAllUsers();
});

describe("GraphQL built-in validation", () => {
  it("throws an error when you pass in a username that's not a string", async () => {
    await testManager
      .getGraphQLResponse(BAD_USERNAME_QUERY)
      .then(testManager.parseError)
      .then((error) => {
        expect(error.message).toContain("string");
      });
  });

  it("throws an error when you pass in an ID that is not a UUID", async () => {
    await testManager
      .getGraphQLResponse(BAD_UUID_QUERY)
      .then(testManager.parseError)
      .then((error) => {
        expect(error.message).toContain("UUID");
      });
  });
});

describe("Querying users", () => {
  it("gets one user by ID", async () => {
    await testManager
      .addUsers([AMY, BOB])
      .then(() => testManager.getGraphQLResponse(GET_ONE_QUERY))
      .then(testManager.parseData)
      .then(({ user }) => {
        expect(AMY).toMatchObject(user);
      });
  });

  it("gets all the users", async () => {
    await testManager
      .addUsers([AMY, BOB])
      .then(() => testManager.getGraphQLResponse(GET_ALL_USERS_QUERY))
      .then(testManager.parseData)
      .then(({ users }) => {
        expect(users).toHaveLength(2);
        expect([AMY, BOB]).toMatchObject(users);
      });
  });

  it("gets no users when ID doesn't exist", async () => {
    await testManager
      .addUsers([])
      .then(() => testManager.getGraphQLResponse(GET_ONE_QUERY))
      .then(testManager.parseDataAndErrors)
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

  it("sends back the user when given the email and the correct password", async () => {
    await testManager
      .getGraphQLResponse(LOGIN_MUTATION_CORRECT)
      .then(testManager.parseData)
      .then(({ login }) => {
        expect(AMY).toMatchObject(login);
      });
  });

  it("sends back a valid JWT when given the email and the correct password", async () => {
    await testManager
      .getGraphQLResponse(LOGIN_MUTATION_WITH_TOKEN)
      .then(testManager.parseData)
      .then(({ login: { token } }) => {
        const parsedToken = jwt.verify(token, jwtSecret) as ParsedToken;
        expect(parsedToken.sub).toBe(AMY.id);

        expect(parsedToken.iat).toBeCloseTo(getCurrentUnixTime());
        expect(parsedToken.exp - parsedToken.iat).toBeCloseTo(14 * 24 * 60 * 60); // 14 days

        expect(() => jwt.verify(token, "wrongsecret")).toThrowError();
      });
  });

  it("sends back an error if the password is wrong", async () => {
    await testManager
      .getGraphQLResponse(LOGIN_MUTATION_INCORRECT_PASSWORD)
      .then(testManager.parseError)
      .then((error) => {
        expect(error.message).toMatch(/login failed/i);
      });
  });

  it("sends back an error if no password is provided", async () => {
    await testManager
      .getGraphQLResponse(LOGIN_MUTATION_NO_PASSWORD)
      .then(testManager.parseError)
      .then((error) => {
        expect(error.message).toContain("password");
      });
  });

  it("sends back an error if no email is provided", async () => {
    await testManager
      .getGraphQLResponse(LOGIN_MUTATION_NO_EMAIL)
      .then(testManager.parseError)
      .then((error) => {
        expect(error.message).toContain("email");
      });
  });
});

describe("Cookies and authentication", () => {
  beforeEach(async () => {
    await testManager.addUsers([AMY, BOB]);
  });

  it("sends back a cookie containing the JWT that is identical to the token in the body, is httpOnly, sameSite=Strict, and has a valid maxAge", async () => {
    await testManager.getRawResponse(LOGIN_MUTATION_WITH_TOKEN).then((rawResponse) => {
      const jwtCookie = testManager.parseCookies(rawResponse)[0];
      const { token } = testManager.parseData(testManager.parseGraphQLResponse(rawResponse)).login;

      expect(jwtCookie.name).toBe("jwt");
      expect(jwtCookie.value).toBe(token);
      expect(jwtCookie.httpOnly).toBe(true);
      expect(jwtCookie.sameSite).toBe("Strict");
      expect(jwtCookie.maxAge).toBe(14 * 24 * 60 * 60);
    });
  });

  it("returns an unauthenticated error when trying to go to the 'me' endpoint without a cookie", async () => {
    await testManager
      .getGraphQLResponse(ME_QUERY)
      .then(testManager.parseError)
      .then((error) => expect(error.message).toMatch(/not logged in/i));
  });

  it("gives you the logged in user when you have the JWT cookie in your 'me' query", async () => {
    const cookies = await testManager.getCookies(LOGIN_MUTATION_CORRECT);

    await testManager
      .getGraphQLResponse(ME_QUERY, cookies)
      .then(testManager.parseData)
      .then(({ me }) => {
        expect(AMY).toMatchObject(me);
      });
  });

  it("returns false when trying to go to the 'logout' endpoint without a cookie (i.e. without being logged in)", async () => {
    await testManager
      .getGraphQLResponse(LOGOUT)
      .then(testManager.parseData)
      .then(({ logout }) => {
        expect(logout).toBe(false);
      });
  });

  it("returns true when going to the 'logout' endpoint while logged in", async () => {
    const cookies = await testManager.getCookies(LOGIN_MUTATION_CORRECT);

    await testManager
      .getGraphQLResponse(LOGOUT, cookies)
      .then(testManager.parseData)
      .then(({ logout }) => {
        expect(logout).toBe(true);
      });
  });

  it("clears the cookies when hitting the 'logout' endpoint while logged in", async () => {
    const cookies = await testManager.getCookies(LOGIN_MUTATION_CORRECT);

    await testManager.getRawResponse(LOGOUT, cookies).then((rawResponse) => {
      const newCookie = testManager.parseCookies(rawResponse)[0];
      expect(newCookie.name).toBe("jwt");
      expect(newCookie.value).toBeFalsy();
    });
  });
});

afterAll(async () => {
  await testManager.destroy();
});
