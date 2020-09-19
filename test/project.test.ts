import { Meet, Project } from "../src/types/gqlGeneratedTypes";
import { ALGOLIA, PAPERJS } from "./src/meetConstants";
import {
  AMY_ALGOLIA_PROJECT,
  AMY_PAPERJS_PROJECT,
  BOB_PAPERJS_PROJECT,
  GET_ALL_MEETS_WITH_NESTED_PROJECTS,
  GET_PROJECT,
  GET_PROJECT_WITH_NESTED_MEET,
  GET_PROJECT_WITH_NESTED_USER,
  GET_USER_WITH_NESTED_PROJECTS,
} from "./src/projectConstants";
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
});

describe("nested queries involving Projects", () => {
  it("gets the user object of the project as a nested field", async () => {
    await testManager.addProjects([AMY_PAPERJS_PROJECT]);

    await testManager
      .getGraphQLData({ query: GET_PROJECT_WITH_NESTED_USER, variables: { id: AMY_PAPERJS_PROJECT.id } })
      .then(({ project }) => expect(AMY).toMatchObject(project.user));
  });

  it("gets the project objects of the user when querying users, sorted by time of submission", async () => {
    await testManager.addProjects([AMY_ALGOLIA_PROJECT, AMY_PAPERJS_PROJECT, BOB_PAPERJS_PROJECT]);

    await testManager
      .getGraphQLData({ query: GET_USER_WITH_NESTED_PROJECTS, variables: { id: BOB.id } })
      .then(({ user }) => {
        expect(user.projects).toHaveLength(1);
      });

    await testManager
      .getGraphQLData({ query: GET_USER_WITH_NESTED_PROJECTS, variables: { id: AMY.id } })
      .then(({ user }) => {
        expect(user.projects).toHaveLength(2);

        const [project1, project2]: Project[] = user.projects;
        expect(project1.createdAt > project2.createdAt).toBe(true);
      });
  });

  it("returns an empty array in the 'projects' field when querying a user that don't have any projects", async () => {
    await testManager.addProjects([AMY_ALGOLIA_PROJECT, AMY_PAPERJS_PROJECT]);

    await testManager
      .getGraphQLData({ query: GET_USER_WITH_NESTED_PROJECTS, variables: { id: BOB.id } })
      .then(({ user }) => {
        expect(user.projects).toHaveLength(0);
      });
  });

  it("gets the project objects of the meet when querying meets, sorted by time of submission", async () => {
    await testManager.addProjects([AMY_PAPERJS_PROJECT, BOB_PAPERJS_PROJECT, AMY_ALGOLIA_PROJECT]);

    await testManager.getGraphQLData({ query: GET_ALL_MEETS_WITH_NESTED_PROJECTS }).then(({ meets }) => {
      const [algolia, paperjs]: Meet[] = meets;
      expect(algolia.projects).toHaveLength(1);
      expect(paperjs.projects).toHaveLength(2);

      const [project1, project2] = paperjs.projects as Project[];
      expect(project1.createdAt > project2.createdAt).toBe(true);
    });
  });

  it("returns an empty array in the 'projects' field when querying meets that don't have any projects", async () => {
    await testManager.addProjects([AMY_ALGOLIA_PROJECT]);

    await testManager.getGraphQLData({ query: GET_ALL_MEETS_WITH_NESTED_PROJECTS }).then(({ meets }) => {
      const [algolia, paperjs]: Meet[] = meets;
      expect(algolia.projects).toHaveLength(1);
      expect(paperjs.projects).toHaveLength(0);
    });
  });

  it("gets the meet object of the project as a nested field", async () => {
    await testManager.addProjects([AMY_PAPERJS_PROJECT]);

    await testManager
      .getGraphQLData({ query: GET_PROJECT_WITH_NESTED_MEET, variables: { id: PAPERJS.id } })
      .then(({ project }) => expect(PAPERJS).toMatchObject(project.meet));
  });
});
