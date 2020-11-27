import { MediaAsset, Meet, Project } from "../src/types/gqlGeneratedTypes";
<<<<<<< HEAD
import {
  AWARD_BADGES,
  GET_MEET_WITH_NESTED_BADGES,
  GET_PROJECT_WITH_NESTED_BADGES,
  WINNER_FIRST,
  WINNER_SECOND,
  WINNER_THIRD,
} from "./src/badgeConstants";
import { GET_PROJECT_WITH_NESTED_MEDIA_ASSETS } from "./src/mediaAssetConstants";
import { ALGOLIA, PAPERJS } from "./src/meetConstants";
=======
import { GET_PROJECT_WITH_NESTED_MEDIA_ASSETS } from "./src/constants/mediaAssetConstants";
import { ALGOLIA, PAPERJS } from "./src/constants/meetConstants";
>>>>>>> 8b997210eeb98198105e8f060125eb5d22ff928d
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
import { ApolloErrorCodeEnum } from "./src/constants/errors";

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
      .getErrorCode({ query: GET_PROJECT, variables: { id: "12345" } })
      .then((errorCode) => expect(errorCode).toBe(ApolloErrorCodeEnum.InternalServerError));
  });

  it("returns an appropriate error message if no UUID is supplied", async () => {
    await testManager.addProjects([AMY_PAPERJS_PROJECT]);

    await testManager
      .getErrorCode({ query: GET_PROJECT, variables: {} })
      .then((errorCode) => expect(errorCode).toBe(ApolloErrorCodeEnum.InternalServerError));
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
      .getErrorCode({ query: CREATE_PROJECT, variables: { input: NEW_PROJECT } })
      .then((errorCode) => expect(errorCode).toBe(ApolloErrorCodeEnum.Unauthenticated));
  });

  it("gives an error message when supplying a userId that differs from cookie's userId", async () => {
    const input = { ...NEW_PROJECT, userId: AMY.id };
    await testManager
      .getErrorCode({
        query: CREATE_PROJECT,
        variables: { input },
        cookies: bobCookies,
      })
      .then((errorCode) => expect(errorCode).toBe(ApolloErrorCodeEnum.Unauthenticated));
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
      .getErrorCode({
        query: CREATE_PROJECT,
        variables: { input },
        cookies: bobCookies,
      })
      .then((errorCode) => expect(errorCode).toBe(ApolloErrorCodeEnum.BadUserInput));
  });

  it("gives an error message when the url is not valid", async () => {
    const input = {
      ...NEW_PROJECT,
      liveUrl: "httpaaaaaaaaaaaaaaaaaaaaa",
    };
    await testManager
      .getErrorCode({
        query: CREATE_PROJECT,
        variables: { input },
        cookies: bobCookies,
      })
      .then((errorCode) => expect(errorCode).toBe(ApolloErrorCodeEnum.BadUserInput));
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
      .getErrorCode({
        query: CREATE_PROJECT,
        variables: { input },
        cookies: bobCookies,
      })
      .then((errorCode) => expect(errorCode).toBe(ApolloErrorCodeEnum.InternalServerError));
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
        testManager.getErrorCode({
          query: DELETE_PROJECT,
          variables: { id: BOB_PAPERJS_PROJECT.id },
          cookies: undefined,
        }),
      )
      .then((errorCode) => expect(errorCode).toBe(ApolloErrorCodeEnum.Unauthenticated));
  });

  it("gives an error message when trying to delete someone else's project", async () => {
    await testManager
      .addProjects([AMY_PAPERJS_PROJECT])
      .then(() =>
        testManager.getErrorCode({
          query: DELETE_PROJECT,
          variables: { id: AMY_PAPERJS_PROJECT.id },
          cookies: bobCookies,
        }),
      )
      .then((errorCode) => expect(errorCode).toBe(ApolloErrorCodeEnum.Unauthenticated));
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
      .getErrorCode({
        query: DELETE_PROJECT,
        variables: { id: AMY_PAPERJS_PROJECT.id },
        cookies: bobCookies,
      })
      .then((errorCode) => expect(errorCode).toBe(ApolloErrorCodeEnum.InternalServerError));
  });
});

describe("awarding badges", () => {
  beforeEach(async () => {
    await testManager.deleteAllBadges();
    await testManager.deleteAllProjects();
    await testManager.addProjects([AMY_PAPERJS_PROJECT]);
    await testManager.addBadges([WINNER_FIRST, WINNER_SECOND, WINNER_THIRD]);
  });

  it("returns project with awarded badge if admin is logged in and gives valid params (single badge)", async () => {
    await testManager
      .getGraphQLResponse({
        query: AWARD_BADGES,
        variables: {
          projectId: AMY_PAPERJS_PROJECT.id,
          badgeIds: [WINNER_FIRST.id],
        },
        cookies: adminCookies,
      })
      .then(testManager.parseData)
      .then(({ awardBadges }) => {
        expect(awardBadges.id).toBe(AMY_PAPERJS_PROJECT.id);
        expect(awardBadges.badges).toEqual(expect.arrayContaining([WINNER_FIRST]));
      });
  });

  it("returns project with awarded badges if admin is logged in and gives valid params (multiple badges)", async () => {
    await testManager
      .getGraphQLResponse({
        query: AWARD_BADGES,
        variables: {
          projectId: AMY_PAPERJS_PROJECT.id,
          badgeIds: [WINNER_FIRST.id, WINNER_SECOND.id, WINNER_THIRD.id],
        },
        cookies: adminCookies,
      })
      .then(testManager.parseData)
      .then(({ awardBadges }) => {
        expect(awardBadges.id).toBe(AMY_PAPERJS_PROJECT.id);
        expect(awardBadges.badges).toEqual(expect.arrayContaining([WINNER_FIRST, WINNER_SECOND, WINNER_THIRD]));
      });
  });

  it("returns project with no badges if given empty array", async () => {
    await testManager
      .getGraphQLResponse({
        query: AWARD_BADGES,
        variables: {
          projectId: AMY_PAPERJS_PROJECT.id,
          badgeIds: [],
        },
        cookies: adminCookies,
      })
      .then(testManager.parseData)
      .then(({ awardBadges }) => {
        expect(awardBadges.id).toBe(AMY_PAPERJS_PROJECT.id);
        expect(awardBadges.badges).toEqual([]);
      });
  });

  it("throws an 'authentication' error if no admin cookies", async () => {
    await testManager
      .getErrorMessage({
        query: AWARD_BADGES,
        variables: {
          projectId: AMY_PAPERJS_PROJECT.id,
          badgeIds: [WINNER_FIRST.id, WINNER_SECOND.id, WINNER_THIRD.id],
        },
        cookies: [],
      })
      .then((errorMessage) => expect(errorMessage).toMatch(/[(not |un)authorized]/i));
  });

  it("gives an error message id of a badge does not exist", async () => {
    // TODO: add validator for badges
    await testManager
      .getErrorMessage({
        query: AWARD_BADGES,
        variables: {
          projectId: AMY_PAPERJS_PROJECT.id,
          badgeIds: ["7fab763c-0bac-4ccc-b2b7-b8587104c10c"],
        },
        cookies: adminCookies,
      })
      .then((errorMessage) => {
        // When properly validated
        // expect(errorMessage).toMatch(/not exist/i);
        expect(errorMessage).toMatch(/server/i);
      });
  });

  it("gives an error message from validator if id of project does not exist", async () => {
    await testManager
      .getErrorMessage({
        query: AWARD_BADGES,
        variables: {
          projectId: "7fab763c-0bac-4ccc-b2b7-b8587104c10c",
          badgeIds: [WINNER_FIRST.id, WINNER_SECOND.id, WINNER_THIRD.id],
        },
        cookies: adminCookies,
      })
      .then((errorMessage) => {
        expect(errorMessage).toMatch(/not exist/i);
      });
  });
});

describe("nested badge queries", () => {
  beforeEach(async () => {
    await testManager.deleteAllBadges();
    await testManager.deleteAllProjects();
    await testManager.deleteAllMeets();
    await testManager.addMeets([PAPERJS]);
    await testManager.addProjects([AMY_PAPERJS_PROJECT]);
    await testManager.addBadges([WINNER_FIRST, WINNER_SECOND, WINNER_THIRD]);
  });

  it("gets the projects that have been awarded this project as a nested field", async () => {
    //award badges to project
    await testManager
      .getGraphQLResponse({
        query: AWARD_BADGES,
        variables: {
          projectId: AMY_PAPERJS_PROJECT.id,
          badgeIds: [WINNER_FIRST.id, WINNER_SECOND.id, WINNER_THIRD.id],
        },
        cookies: adminCookies,
      })
      .then(testManager.parseData)
      .then(({ awardBadges }) => {
        expect(awardBadges.id).toBe(AMY_PAPERJS_PROJECT.id);
      });

    //then query for the new data
    await testManager
      .getGraphQLResponse({
        query: GET_PROJECT_WITH_NESTED_BADGES,
        variables: {
          id: AMY_PAPERJS_PROJECT.id,
        },
      })
      .then(testManager.parseData)
      .then(({ project }) => {
        expect(project.id).toMatch(AMY_PAPERJS_PROJECT.id);
        expect(project.badges).toEqual(expect.arrayContaining([WINNER_FIRST, WINNER_SECOND, WINNER_THIRD]));
      });
  });

  it("returns a meet with nested project and badges", async () => {
    await testManager
      .getGraphQLResponse({
        query: GET_MEET_WITH_NESTED_BADGES,
        variables: {
          id: PAPERJS.id,
        },
      })
      .then(testManager.parseData)
      .then(({ meet }) => {
        expect(meet.id).toBe(PAPERJS.id);
      });
  });
});
