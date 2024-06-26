import {
  CREATE_BADGE,
  DELETE_BADGE,
  EDIT_BADGE,
  EDIT_BADGE_INPUT,
  GET_ALL_BADGES,
  GET_BADGE_BY_ID,
  NEW_BADGE_INPUT,
  WINNER_FIRST,
  WINNER_SECOND,
} from "./src/constants/badgeConstants";
import { ApolloErrorCodeEnum } from "./src/constants/errors";
import TestManager from "./src/TestManager";
import { getAdminCookies } from "./src/util";

const testManager = TestManager.build();

let adminCookies: string[];

beforeAll(async () => {
  await testManager.deleteAllUsers();
  await testManager.deleteAllBadges();
  adminCookies = await getAdminCookies();
});

beforeEach(async () => {
  await testManager.deleteAllBadges();
});

afterAll(async () => {
  await testManager.deleteAllBadges();
  await testManager.destroy();
});

describe("querying badges", () => {
  it("gets all badges", async () => {
    await testManager
      .addBadges([WINNER_FIRST, WINNER_SECOND])
      .then(() => testManager.getGraphQLResponse({ query: GET_ALL_BADGES }).then(testManager.parseData))
      .then(({ badges }) => {
        expect(badges).toHaveLength(2);
      });
  });
  it("returns an empty array if there are no badges", async () => {
    await testManager
      .addBadges([])
      .then(() => testManager.getGraphQLResponse({ query: GET_ALL_BADGES }).then(testManager.parseData))
      .then(({ badges }) => {
        expect(badges).toHaveLength(0);
      });
  });
  it("gets a badge by id", async () => {
    await testManager
      .addBadges([WINNER_FIRST])
      .then(() =>
        testManager
          .getGraphQLResponse({ query: GET_BADGE_BY_ID, variables: { id: WINNER_FIRST.id } })
          .then(testManager.parseData),
      )
      .then(({ badge }) => {
        expect(WINNER_FIRST).toMatchObject(badge);
      });
  });
});

describe("creating badges", () => {
  beforeAll(async () => {
    adminCookies = await getAdminCookies();
  });
  it("creates a badge successfully when admin is logged in", async () => {
    await testManager
      .getGraphQLResponse({
        query: CREATE_BADGE,
        variables: { input: NEW_BADGE_INPUT },
        cookies: adminCookies,
      })
      .then(testManager.parseData)
      .then(({ createBadge }) => {
        expect(createBadge).toMatchObject(NEW_BADGE_INPUT);
      });
  });
  it("returns an 'unauthorized' error message when creating a badge without admin cookies", async () => {
    await testManager.getErrorCode({ query: CREATE_BADGE, variables: { input: NEW_BADGE_INPUT } }).then((errorCode) => {
      expect(errorCode).toBe(ApolloErrorCodeEnum.Unauthenticated);
    });
  });
  it("returns an appropriate error message when a field is missing", async () => {
    await testManager
      .getErrorCode({
        query: CREATE_BADGE,
        variables: { input: { ...CREATE_BADGE, alias: undefined } },
        cookies: adminCookies,
      })
      .then((errorCode) => {
        expect(errorCode).toBe(ApolloErrorCodeEnum.InternalServerError);
      });
  });
  it("returns an appropriate error message when a field is in wrong type", async () => {
    await testManager
      .getErrorCode({
        query: CREATE_BADGE,
        variables: { input: { ...CREATE_BADGE, alias: 100 } },
        cookies: adminCookies,
      })
      .then((errorCode) => {
        expect(errorCode).toBe(ApolloErrorCodeEnum.InternalServerError);
      });
  });
});

describe("Editing badges", () => {
  let badgeId: string;

  beforeAll(async () => {
    adminCookies = await getAdminCookies();
  });

  // Create a constant badge that will be edited and get its ID
  beforeEach(async () => {
    await testManager
      .getGraphQLResponse({
        query: CREATE_BADGE,
        variables: { input: NEW_BADGE_INPUT },
        cookies: adminCookies,
      })
      .then(testManager.parseData)
      .then(({ createBadge }) => {
        badgeId = createBadge.id;
      });
  });

  it("edits a badge successfully when an admin is logged in", async () => {
    await testManager
      .getGraphQLResponse({
        query: EDIT_BADGE,
        variables: { id: badgeId, input: EDIT_BADGE_INPUT },
        cookies: adminCookies,
      })
      .then(testManager.parseData)
      .then(({ editBadge }) => {
        expect(editBadge.description).not.toBe(NEW_BADGE_INPUT.description);
        expect(editBadge.description).toBe(EDIT_BADGE_INPUT.description);
      });
  });

  it("updates the updatedAt timestamp after editing a badge", async () => {
    await testManager.getGraphQLData({ query: GET_ALL_BADGES }).then(({ badges }) => {
      expect(badges[0].createdAt).toBe(badges[0].updatedAt);
    });

    await testManager
      .getGraphQLData({
        query: EDIT_BADGE,
        variables: { id: badgeId, input: EDIT_BADGE_INPUT },
        cookies: adminCookies,
      })
      .then(({ editBadge }) => {
        expect(editBadge.createdAt < editBadge.updatedAt).toBe(true);
      });
  });

  it("returns 'unauthorized' error message when editing a badge without admin cookies", async () => {
    await testManager
      .getErrorCode({
        query: EDIT_BADGE,
        variables: { id: badgeId, input: EDIT_BADGE_INPUT },
        cookies: [],
      })
      .then((errorCode) => {
        expect(errorCode).toBe(ApolloErrorCodeEnum.Unauthenticated);
      });
  });

  it("gives an error message from the validator when the id of the badge does not exist", async () => {
    await testManager
      .getErrorCode({
        query: EDIT_BADGE,
        variables: { id: "7fab763c-0bac-4ccc-b2b7-b8587104c10c", input: EDIT_BADGE_INPUT },
        cookies: adminCookies,
      })
      .then((errorCode) => {
        expect(errorCode).toBe(ApolloErrorCodeEnum.InternalServerError);
      });
  });

  it("gives an error when no edit fields are specified in the mutation", async () => {
    await testManager
      .getErrorCode({
        query: EDIT_BADGE,
        variables: { id: badgeId, input: {} },
        cookies: adminCookies,
      })
      .then((errorCode) => {
        expect(errorCode).toBe(ApolloErrorCodeEnum.BadUserInput);
      });
  });

  it("gives an error message when trying to edit a non-existent field", async () => {
    await testManager
      .getErrorCode({
        query: EDIT_BADGE,
        variables: { id: badgeId, input: { nonexistent: "hello" } },
        cookies: adminCookies,
      })
      .then((errorCode) => {
        expect(errorCode).toBe(ApolloErrorCodeEnum.InternalServerError);
      });
  });
});

describe("deleting badges", () => {
  let badgeId: string;

  // Create a constant badge that will be deleted and get its ID
  beforeEach(async () => {
    await testManager
      .getGraphQLResponse({
        query: CREATE_BADGE,
        variables: { input: NEW_BADGE_INPUT },
        cookies: adminCookies,
      })
      .then(testManager.parseData)
      .then(({ createBadge }) => {
        badgeId = createBadge.id;
      });
  });

  it("deletes a badge successfully when an admin is logged in", async () => {
    await testManager.getGraphQLData({ query: GET_ALL_BADGES }).then(({ badges }) => expect(badges).toHaveLength(1));
    await testManager
      .getGraphQLData({
        query: DELETE_BADGE,
        variables: { id: badgeId },
        cookies: adminCookies,
      })
      .then(({ deleteBadge }) => {
        expect(deleteBadge).toBe(true);
      });
  });

  it("returns 'unauthorized' error when deleting badge without admin cookies", async () => {
    await testManager
      .getErrorCode({
        query: DELETE_BADGE,
        variables: { id: badgeId },
        cookies: [],
      })
      .then((errorCode) => {
        expect(errorCode).toBe(ApolloErrorCodeEnum.Unauthenticated);
      });
  });
  it("gives an error message from validator if id of badge does not exist", async () => {
    await testManager
      .getErrorCode({
        query: DELETE_BADGE,
        variables: { id: "7fab763c-0bac-4ccc-b2b7-b8587104c10c" },
        cookies: adminCookies,
      })
      .then((errorCode) => {
        expect(errorCode).toBe(ApolloErrorCodeEnum.InternalServerError);
      });
  });
});
