import { MediaAsset, Meet, Project } from "../src/types/gqlGeneratedTypes";
import { GET_PROJECT_WITH_NESTED_MEDIA_ASSETS } from "./src/constants/mediaAssetConstants";
import { ALGOLIA, PAPERJS } from "./src/constants/meetConstants";
import {
  AMY_ALGOLIA_PROJECT,
  AMY_PAPERJS_PROJECT,
  BOB_PAPERJS_PROJECT,
  CREATE_PROJECT,
  DELETE_PROJECT,
  GET_ALL_MEETS_WITH_NESTED_PROJECTS,
  GET_PROJECT,
  GET_PROJECT_WITH_NESTED_MEET,
  GET_PROJECT_WITH_NESTED_USER,
  GET_USER_WITH_NESTED_PROJECTS,
  NEW_PROJECT,
  NEW_PROJECT_WITH_MEDIA_ASSETS,
} from "./src/constants/projectConstants";
import TestManager from "./src/TestManager";
import { AMY, BOB } from "./src/constants/userConstants";
import { getAdminCookies, getBobCookies } from "./src/util";

const testManager = TestManager.build();

let bobCookies: string[];
let adminCookies: string[];

// Add foreign keys to DB, get cookies
beforeAll(async () => {
  await testManager.deleteAllUsers();
  await testManager.deleteAllMeets();
  bobCookies = await getBobCookies();
  adminCookies = await getAdminCookies();
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

describe("Creating projects without media assets", () => {
  it("creates a project when user is logged in, and given all the required info", async () => {
    await testManager
      .getGraphQLData({ query: CREATE_PROJECT, variables: { input: NEW_PROJECT }, cookies: bobCookies })
      .then(({ createProject }) => expect(createProject).toMatchObject(NEW_PROJECT));
  });

  it("creates a project when user is logged in, and given all the required info but leaving out meetId", async () => {
    const newProjectWithoutMeetId = (({ title, sourceCodeUrl, liveUrl }) => ({
      title,
      sourceCodeUrl,
      liveUrl,
    }))(NEW_PROJECT);
    await testManager
      .getGraphQLData({ query: CREATE_PROJECT, variables: { input: newProjectWithoutMeetId }, cookies: bobCookies })
      .then(({ createProject }) => expect(createProject).toMatchObject(newProjectWithoutMeetId));
  });

  it("gives an error message when accessing createProject without being logged in", async () => {
    await testManager
      .getErrorMessage({ query: CREATE_PROJECT, variables: { input: NEW_PROJECT } })
      .then((errorMessage) => expect(errorMessage).toMatch(/[(not | un)]authorized/i));
  });

  it("gives an error message when supplying a userId that differs from cookie's userId", async () => {
    const input = { ...NEW_PROJECT, userId: AMY.id };
    await testManager
      .getErrorMessage({
        query: CREATE_PROJECT,
        variables: { input },
        cookies: bobCookies,
      })
      .then((errorMessage) => expect(errorMessage).toMatch(/[(not | un)]authorized/i));
  });

  it("does not give an error message when supplying a userId that is the same as cookie's userId", async () => {
    const input = { ...NEW_PROJECT, userId: BOB.id };
    await testManager
      .getGraphQLData({
        query: CREATE_PROJECT,
        variables: { input },
        cookies: bobCookies,
      })
      .then(({ createProject }) => expect(createProject).toMatchObject(NEW_PROJECT));
  });

  it("does not give an error message when supplying a userId that differs from cookie's userId but user is admin", async () => {
    const input = { ...NEW_PROJECT, userId: BOB.id };
    await testManager
      .getGraphQLData({
        query: CREATE_PROJECT,
        variables: { input },
        cookies: adminCookies,
      })
      .then(({ createProject }) => expect(createProject).toMatchObject(NEW_PROJECT));
  });

  it("gives an error message when the title is too long", async () => {
    const input = {
      ...NEW_PROJECT,
      title:
        "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",
    };
    await testManager
      .getErrorMessage({
        query: CREATE_PROJECT,
        variables: { input },
        cookies: bobCookies,
      })
      .then((errorMessage) => expect(errorMessage).toMatch(/title/i));
  });

  it("gives an error message when the url is not valid", async () => {
    const input = {
      ...NEW_PROJECT,
      liveUrl: "httpaaaaaaaaaaaaaaaaaaaaa",
    };
    await testManager
      .getErrorMessage({
        query: CREATE_PROJECT,
        variables: { input },
        cookies: bobCookies,
      })
      .then((errorMessage) => expect(errorMessage).toMatch(/url/i));
  });
});

describe("Creating projects with media assets", () => {
  it("creates a project with media assets when user is logged in, and given all the required info, which is later queryable", async () => {
    await testManager
      .getGraphQLData({
        query: CREATE_PROJECT,
        variables: { input: NEW_PROJECT_WITH_MEDIA_ASSETS },
        cookies: bobCookies,
      })
      .then(({ createProject }) => {
        const { mediaAssets }: { mediaAssets: MediaAsset[] } = createProject;
        expect(mediaAssets).toHaveLength(2);
        const [mediaAsset1, mediaAsset2] = mediaAssets;
        expect(mediaAsset1.index).toBeLessThan(mediaAsset2.index);

        testManager
          .getGraphQLData({ query: GET_PROJECT_WITH_NESTED_MEDIA_ASSETS, variables: { id: createProject.id } })
          .then(({ project }) => expect(project.mediaAssets).toHaveLength(2));
      });

    await testManager
      .addProjects([BOB_PAPERJS_PROJECT])
      .then(() =>
        testManager.getGraphQLData({
          query: GET_PROJECT_WITH_NESTED_MEDIA_ASSETS,
          variables: { id: BOB_PAPERJS_PROJECT.id },
        }),
      )
      .then(({ project }) => expect(project.mediaAssets).toHaveLength(0));
  });

  it("gives an error message when the mediaAssets is not an array of strings", async () => {
    const input = {
      ...NEW_PROJECT,
      mediaAssets: [1, 2],
    };
    await testManager
      .getErrorMessage({
        query: CREATE_PROJECT,
        variables: { input },
        cookies: bobCookies,
      })
      .then((errorMessage) => expect(errorMessage).toMatch(/mediaAssets/i));
  });
});

describe("Deleting projects", () => {
  it("deletes a project that has no media assets", async () => {
    await testManager
      .addProjects([BOB_PAPERJS_PROJECT])
      .then(() =>
        testManager.getGraphQLData({
          query: GET_PROJECT,
          variables: { id: BOB_PAPERJS_PROJECT.id },
        }),
      )
      .then(({ project }) => expect(project).toBeDefined());

    await testManager
      .getGraphQLData({ query: DELETE_PROJECT, variables: { id: BOB_PAPERJS_PROJECT.id }, cookies: bobCookies })
      .then(({ deleteProject }) => expect(deleteProject).toBe(true));

    await testManager
      .getGraphQLData({
        query: GET_PROJECT,
        variables: { id: BOB_PAPERJS_PROJECT.id },
      })
      .then(({ project }) => expect(project).toBeNull);
  });

  it("gives an error message when deleting a project while not logged in", async () => {
    await testManager
      .addProjects([BOB_PAPERJS_PROJECT])
      .then(() =>
        testManager.getErrorMessage({
          query: DELETE_PROJECT,
          variables: { id: BOB_PAPERJS_PROJECT.id },
          cookies: undefined,
        }),
      )
      .then((errorMessage) => expect(errorMessage).toMatch(/[(not |un)]authorized/i));
  });

  it("gives an error message when trying to delete someone else's project", async () => {
    await testManager
      .addProjects([AMY_PAPERJS_PROJECT])
      .then(() =>
        testManager.getErrorMessage({
          query: DELETE_PROJECT,
          variables: { id: AMY_PAPERJS_PROJECT.id },
          cookies: bobCookies,
        }),
      )
      .then((errorMessage) => expect(errorMessage).toMatch(/[(not |un)]authorized/i));
  });

  it("lets the admin delete someone else's project", async () => {
    await testManager
      .addProjects([BOB_PAPERJS_PROJECT])
      .then(() =>
        testManager.getGraphQLData({
          query: DELETE_PROJECT,
          variables: { id: BOB_PAPERJS_PROJECT.id },
          cookies: adminCookies,
        }),
      )
      .then(({ deleteProject }) => expect(deleteProject).toBe(true));
  });

  it("gives an error message when trying to delete a project that doesn't exist", async () => {
    await testManager
      .getErrorMessage({
        query: DELETE_PROJECT,
        variables: { id: AMY_PAPERJS_PROJECT.id },
        cookies: bobCookies,
      })
      .then((errorMessage) => expect(errorMessage).toMatch(/not exist/i));
  });
});
