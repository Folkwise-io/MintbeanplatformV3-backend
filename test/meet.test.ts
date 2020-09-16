import { ALGOLIA, GET_ALL_MEETS, PAPERJS } from "./src/meetConstants";
import TestManager from "./src/TestManager";

const testManager = TestManager.build();

beforeEach(async () => {
  await testManager.deleteAllMeets();
});

afterAll(async () => {
  await testManager.deleteAllMeets();
  await testManager.destroy();
});

describe("Querying meets", () => {
  it("gets a meet", async () => {
    await testManager
      .addMeets([PAPERJS, ALGOLIA])
      .then(() => testManager.getGraphQLResponse({ query: GET_ALL_MEETS }).then(testManager.parseData))
      .then(({ meets }) => {
        expect(meets[0]).toBeDefined();
      });
  });
});
