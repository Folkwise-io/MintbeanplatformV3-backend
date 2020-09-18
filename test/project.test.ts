import { ALGOLIA, PAPERJS } from "./src/meetConstants";
import { AMY_ALGOLIA_PROJECT, AMY_PAPERJS_PROJECT, GET_PROJECT } from "./src/projectConstants";
import TestManager from "./src/TestManager";
import { AMY, BOB } from "./src/userConstants";

const testManager = TestManager.build();

// Add foreign keys to DB
beforeAll(async () => {
  await testManager.deleteAllUsers();
  await testManager.deleteAllMeets();
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

describe("'project' by id root query", () => {
  it("gets a project by id", async () => {
    await testManager.addProjects([AMY_PAPERJS_PROJECT]);

    await testManager
      .getGraphQLData({ query: GET_PROJECT, variables: { id: AMY_PAPERJS_PROJECT.id } })
      .then(({ project }) => expect(project).toMatchObject(AMY_PAPERJS_PROJECT));
  });

  it("returns null if project id does not exist", async () => {
    await testManager.addProjects([AMY_PAPERJS_PROJECT]);

    await testManager
      .getGraphQLData({ query: GET_PROJECT, variables: { id: AMY_ALGOLIA_PROJECT.id } })
      .then(({ project }) => expect(project).toBeNull());
  });

  it("returns an appropriate error message if UUID is malformed", async () => {
    await testManager.addProjects([AMY_PAPERJS_PROJECT]);

    await testManager
      .getErrorMessage({ query: GET_PROJECT, variables: { id: "12345" } })
      .then((errorMessage) => expect(errorMessage).toMatch(/invalid.*UUID/i));
  });

  it("returns an appropriate error message if no UUID is supplied", async () => {
    await testManager.addProjects([AMY_PAPERJS_PROJECT]);

    await testManager
      .getErrorMessage({ query: GET_PROJECT, variables: {} })
      .then((errorMessage) => expect(errorMessage).toMatch(/id.*not provided/i));
  });

  it("gets the user object of the project as a nested field", async () => {
    await testManager.addProjects([AMY_PAPERJS_PROJECT]);

    await testManager
      .getGraphQLData({ query: GET_PROJECT, variables: { id: AMY_PAPERJS_PROJECT.id } })
      .then(({ project }) => expect(project.user).toMatchObject(AMY));
  });
});
