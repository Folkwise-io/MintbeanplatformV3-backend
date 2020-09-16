import { Meet } from "../src/types/gqlGeneratedTypes";
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
      .addMeets([PAPERJS])
      .then(() => testManager.getGraphQLResponse({ query: GET_ALL_MEETS }).then(testManager.parseData))
      .then(({ meets }) => {
        const [meet1] = meets;
        expect(PAPERJS).toMatchObject(meet1);
      });
  });

  it("gets all meets in order of descending startTime", async () => {
    await testManager
      .addMeets([PAPERJS, ALGOLIA])
      .then(() => testManager.getGraphQLResponse({ query: GET_ALL_MEETS }).then(testManager.parseData))
      .then(({ meets }) => {
        expect(meets).toHaveLength(2);
        const [meet1, meet2] = meets as Meet[];
        expect(meet1.startTime > meet2.startTime).toBe(true);
      });
  });

  it("returns empty array if there are no meets", async () => {
    await testManager
      .addMeets([])
      .then(() => testManager.getGraphQLResponse({ query: GET_ALL_MEETS }).then(testManager.parseData))
      .then(({ meets }) => {
        expect(meets).toHaveLength(0);
      });
  });

  it("does not retrieve deleted meets", async () => {
    await testManager
      .addMeets([PAPERJS, { ...ALGOLIA, deleted: true } as any])
      .then(() => testManager.getGraphQLResponse({ query: GET_ALL_MEETS }).then(testManager.parseData))
      .then(({ meets }) => {
        expect(meets).toHaveLength(1);
      });
  });
});
