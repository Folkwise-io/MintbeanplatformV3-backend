import {
  ALGOLIA_3,
  AMY_ANIMATION_TOYS_2_REGISTRATION,
  ANIMATION_TOYS_2,
  GET_USER_REGISTERED_MEETS_QUERY,
  REGISTER_FOR_MEET_QUERY,
} from "./src/meetRegistrationConstants";
import TestManager from "./src/TestManager";
import { AMY, AMY_CREDENTIALS, BOB, LOGIN } from "./src/userConstants";

const testManager = TestManager.build();

beforeAll(async () => {
  await testManager.deleteAllUsers();
  await testManager.deleteAllMeets();
  await testManager.addUsers([AMY, BOB]);
  await testManager.addMeets([ANIMATION_TOYS_2, ALGOLIA_3]);
});

beforeEach(async () => {
  await testManager.deleteAllMeetRegistrations();
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
});

describe.skip("Registering for a meet", () => {
  beforeAll(async () => {});

  it("lets a logged in user register for a meet", async () => {
    const cookies = await testManager.getCookies({
      query: LOGIN,
      variables: AMY_CREDENTIALS,
    });

    await testManager
      .getGraphQLData({ query: REGISTER_FOR_MEET_QUERY, variables: { id: ANIMATION_TOYS_2.id }, cookies })
      .then((registerForMeet) => expect(registerForMeet).toBe(true));
  });
});
