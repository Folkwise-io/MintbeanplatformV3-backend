import { ALGOLIA_3, AMY_ANIMATION_TOYS_2_REGISTRATION, ANIMATION_TOYS_2 } from "./src/registrationConstants";
import TestManager from "./src/TestManager";
import { AMY, BOB, GET_USER_QUERY } from "./src/userConstants";

const testManager = TestManager.build();

beforeAll(async () => {
  await testManager.deleteAllUsers();
  await testManager.deleteAllMeets();
});

beforeEach(async () => {
  await testManager.deleteAllMeetRegistrations();
});

describe("Querying to find registrants of meets", () => {
  beforeAll(async () => {
    await testManager.addUsers([AMY, BOB]);
    await testManager.addMeets([ANIMATION_TOYS_2, ALGOLIA_3]);
  });

  it("returns a list of meets that a user has registered for", async () => {
    await testManager.addMeetRegistrations([AMY_ANIMATION_TOYS_2_REGISTRATION]);
    await testManager
      .getGraphQLData({ query: GET_USER_QUERY, variables: { id: AMY.id } })
      .then(({ registeredMeets }) => {
        expect(registeredMeets).toMatchObject(ANIMATION_TOYS_2);
      });
  });
});
