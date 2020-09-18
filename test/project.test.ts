import { ALGOLIA, PAPERJS } from "./src/meetConstants";
import { AMY_PAPERJS_PROJECT, GET_PROJECT } from "./src/projectConstants";
import TestManager from "./src/TestManager";
import { AMY, BOB } from "./src/userConstants";

const testManager = TestManager.build();

// Add foreign keys to DB
beforeAll(async () => {
  await testManager.addUsers([AMY, BOB]);
  await testManager.addMeets([PAPERJS, ALGOLIA]);
});

beforeEach(async () => {
  await testManager.deleteAllProjects();
});

afterAll(async () => {
  await testManager.deleteAllProjects();
  await testManager.destroy();
});

describe("'project' query", () => {
  it("gets a project by id", async () => {
    await testManager.addProjects([AMY_PAPERJS_PROJECT]);
    await testManager
      .getGraphQLData({ query: GET_PROJECT, variables: { id: AMY_PAPERJS_PROJECT.id } })
      .then(({ project }) => expect(project).toMatchObject(AMY_PAPERJS_PROJECT));
  });
});
