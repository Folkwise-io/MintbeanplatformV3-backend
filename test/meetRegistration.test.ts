import { ALGOLIA } from "./src/meetConstants";
import {
  ALGOLIA_3,
  AMY_ANIMATION_TOYS_2_REGISTRATION,
  ANIMATION_TOYS_2,
  GET_MY_REGISTERED_MEETS_QUERY,
  GET_USER_REGISTERED_MEETS_QUERY,
  REGISTER_FOR_MEET_QUERY,
} from "./src/meetRegistrationConstants";
import TestManager from "./src/TestManager";
import { AMY, BOB } from "./src/userConstants";
import { getBobCookies, getAdminCookies } from "./src/util";

const testManager = TestManager.build();
let bobCookies: string[];
let adminCookies: string[];

beforeAll(async () => {
  await testManager.deleteAllUsers();
  await testManager.deleteAllMeets();
  bobCookies = await getBobCookies();
  adminCookies = await getAdminCookies();
  await testManager.addUsers([AMY, BOB]);
  await testManager.addMeets([ANIMATION_TOYS_2, ALGOLIA_3]);
});

beforeEach(async () => {
  await testManager.deleteAllMeetRegistrations();
});

afterAll(async () => {
  await testManager.deleteAllMeetRegistrations();
  await testManager.deleteAllMeets();
  await testManager.deleteAllUsers();
  await testManager.destroy();
});

describe("Querying to find registrants of meets", () => {
  it("returns a list of meets that a user has registered for", async () => {
    await testManager.addMeetRegistrations([AMY_ANIMATION_TOYS_2_REGISTRATION]);
    await testManager
      .getGraphQLData({ query: GET_USER_REGISTERED_MEETS_QUERY, variables: { id: AMY.id } })
      .then(({ user }) => {
        expect(ANIMATION_TOYS_2).toMatchObject(user.registeredMeets[0]);
      });
  });

  it("returns a list of meets that the current has registered form using cookies", async () => {
    await testManager.addMeetRegistrations([AMY_ANIMATION_TOYS_2_REGISTRATION]);
    await testManager.getGraphQLData({ query: GET_MY_REGISTERED_MEETS_QUERY, cookies: adminCookies }).then(({ me }) => {
      expect(ANIMATION_TOYS_2).toMatchObject(me.registeredMeets[0]);
    });
  });
});

describe("Registering for a meet", () => {
  beforeAll(async () => {});

  it("lets a logged in user register for a meet and then the meet shows up in registeredMeets query", async () => {
    await testManager
      .getGraphQLData({ query: REGISTER_FOR_MEET_QUERY, variables: { id: ANIMATION_TOYS_2.id }, cookies: adminCookies })
      .then(({ registerForMeet }) => expect(registerForMeet).toBe(true));

    await testManager.getGraphQLData({ query: GET_MY_REGISTERED_MEETS_QUERY, cookies: adminCookies }).then(({ me }) => {
      expect(ANIMATION_TOYS_2).toMatchObject(me.registeredMeets[0]);
    });
  });

  it("returns an error message if trying to register without being logged in", async () => {
    await testManager
      .getErrorMessage({ query: REGISTER_FOR_MEET_QUERY, variables: { id: ANIMATION_TOYS_2.id }, cookies: undefined })
      .then((errorMsg) => expect(errorMsg).toMatch(/not authorized/i));
  });

  it("returns an error message if trying to register for non-existent meet", async () => {
    await testManager
      .getErrorMessage({ query: REGISTER_FOR_MEET_QUERY, variables: { id: ALGOLIA.id }, cookies: adminCookies })
      .then((errorMsg) => expect(errorMsg).toMatch(/exist/i));
  });
});
