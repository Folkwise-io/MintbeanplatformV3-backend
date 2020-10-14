import { Meet } from "../src/types/gqlGeneratedTypes";
import {
  ALGOLIA,
  CREATE_MEET,
  DELETE_MEET,
  EDIT_MEET,
  EDIT_MEET_INPUT,
  GET_ALL_MEETS,
  GET_MEETS_BY_ID,
  NEW_MEET_INPUT,
  PAPERJS,
} from "./src/meetConstants";
import TestManager from "./src/TestManager";
import { getAdminCookies } from "./src/util";

const testManager = TestManager.build();

beforeEach(async () => {
  await testManager.deleteAllMeets();
});

afterAll(async () => {
  await testManager.deleteAllMeets();
  await testManager.deleteAllUsers();
  await testManager.destroy();
});

describe.skip("Querying meets", () => {
  it("gets a meet by id", async () => {
    await testManager
      .addMeets([PAPERJS])
      .then(() =>
        testManager
          .getGraphQLResponse({ query: GET_MEETS_BY_ID, variables: { id: PAPERJS.id } })
          .then(testManager.parseData),
      )
      .then(({ meet }) => {
        expect(PAPERJS).toMatchObject(meet);
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

describe.skip("Creating meets", () => {
  let adminCookies: string[];

  beforeAll(async () => {
    adminCookies = await getAdminCookies();
  });

  it("creates a meet successfully when admin is logged in", async () => {
    await testManager
      .getGraphQLResponse({
        query: CREATE_MEET,
        variables: { input: NEW_MEET_INPUT },
        cookies: adminCookies,
      })
      .then(testManager.parseData)
      .then(({ createMeet }) => {
        expect(createMeet).toMatchObject(NEW_MEET_INPUT);
      });
  });

  it("returns an 'unauthorized' error message when creating a meet without admin cookies", async () => {
    await testManager
      .getErrorMessage({ query: CREATE_MEET, variables: { input: NEW_MEET_INPUT } })
      .then((errorMessage) => {
        expect(errorMessage).toMatch(/[(not |un)]authorized/i);
      });
  });

  it("returns an appropriate error message when a field is missing", async () => {
    await testManager
      .getErrorMessage({
        query: CREATE_MEET,
        variables: { input: { ...NEW_MEET_INPUT, description: undefined } },
        cookies: adminCookies,
      })
      .then((errorMessage) => {
        expect(errorMessage).toMatch(/description/i);
      });
  });

  it("returns an appropriate error message when a field is in wrong type", async () => {
    await testManager
      .getErrorMessage({
        query: CREATE_MEET,
        variables: { input: { ...NEW_MEET_INPUT, title: 100 } },
        cookies: adminCookies,
      })
      .then((errorMessage) => {
        expect(errorMessage).toMatch(/title/i);
      });
  });
});

describe.skip("Editing meets", () => {
  let cookies: string[];
  let meetId: string;

  beforeAll(async () => {
    cookies = await getAdminCookies();
  });

  // Create a constant meet that will be edited and get its ID
  beforeEach(async () => {
    await testManager
      .getGraphQLResponse({
        query: CREATE_MEET,
        variables: { input: NEW_MEET_INPUT },
        cookies,
      })
      .then(testManager.parseData)
      .then(({ createMeet }) => {
        meetId = createMeet.id;
      });
  });

  it("edits a meet successfully when admin is logged in", async () => {
    await testManager
      .getGraphQLResponse({
        query: EDIT_MEET,
        variables: { id: meetId, input: EDIT_MEET_INPUT },
        cookies,
      })
      .then(testManager.parseData)
      .then(({ editMeet }) => {
        expect(editMeet.title).not.toBe(NEW_MEET_INPUT.title);
        expect(editMeet.title).toBe(EDIT_MEET_INPUT.title);
        expect(editMeet.registerLink).toBe(EDIT_MEET_INPUT.registerLink);
      });
  });

  it("updates the updatedAt timestamp after editing a meet", async () => {
    // Check that createdAt is initially equal to updatedAt
    await testManager
      .getGraphQLData({ query: GET_ALL_MEETS })
      .then(({ meets }) => expect(meets[0].createdAt).toBe(meets[0].updatedAt));

    await testManager
      .getGraphQLData({
        query: EDIT_MEET,
        variables: { id: meetId, input: EDIT_MEET_INPUT },
        cookies,
      })
      .then(({ editMeet }) => {
        expect(editMeet.createdAt < editMeet.updatedAt).toBe(true);
      });
  });

  it("returns an 'unauthorized' error message when editing a meet without admin cookies", async () => {
    await testManager
      .getErrorMessage({
        query: EDIT_MEET,
        variables: { id: meetId, input: EDIT_MEET_INPUT },
        cookies: [],
      })
      .then((errorMessage) => {
        expect(errorMessage).toMatch(/[(not |un)authorized]/i);
      });
  });

  it("gives an error message from validator when the id of the meet does not exist", async () => {
    await testManager
      .getErrorMessage({
        query: EDIT_MEET,
        variables: { id: "7fab763c-0bac-4ccc-b2b7-b8587104c10c", input: EDIT_MEET_INPUT },
        cookies,
      })
      .then((errorMessage) => {
        expect(errorMessage).toMatch(/not exist/i);
      });
  });

  it("gives an error message when no edit fields are specified in the mutation", async () => {
    await testManager
      .getErrorMessage({
        query: EDIT_MEET,
        variables: { id: meetId, input: {} },
        cookies,
      })
      .then((errorMessage) => {
        expect(errorMessage).toMatch(/field/i);
      });
  });

  it("gives an error message when trying to edit a non-existent field", async () => {
    await testManager
      .getErrorMessage({
        query: EDIT_MEET,
        variables: { id: meetId, input: { nonexistent: "hello" } },
        cookies,
      })
      .then((errorMessage) => {
        expect(errorMessage).toMatch(/invalid/i);
      });
  });

  it("gives an error message when trying to edit a field that exists in db but is not defined in schema", async () => {
    await testManager
      .getErrorMessage({
        query: EDIT_MEET,
        variables: { id: meetId, input: { deleted: true } },
        cookies,
      })
      .then((errorMessage) => {
        expect(errorMessage).toMatch(/invalid/i);
      });
  });
});

describe.skip("Deleting meets", () => {
  let cookies: string[];
  let meetId: string;

  beforeAll(async () => {
    cookies = await getAdminCookies();
  });

  // Create a constant meet that will be edited and get its ID
  beforeEach(async () => {
    await testManager
      .getGraphQLResponse({
        query: CREATE_MEET,
        variables: { input: NEW_MEET_INPUT },
        cookies,
      })
      .then(testManager.parseData)
      .then(({ createMeet }) => {
        meetId = createMeet.id;
      });
  });

  it("deletes a meet successfully when admin is logged in", async () => {
    await testManager.getGraphQLData({ query: GET_ALL_MEETS }).then(({ meets }) => expect(meets).toHaveLength(1));

    await testManager
      .getGraphQLData({
        query: DELETE_MEET,
        variables: { id: meetId },
        cookies,
      })
      .then(({ deleteMeet }) => {
        expect(deleteMeet).toBe(true);
      });

    await testManager.getGraphQLData({ query: GET_ALL_MEETS }).then(({ meets }) => expect(meets).toHaveLength(0));
  });

  it("returns an 'unauthorized' error message when deleting a meet without admin cookies", async () => {
    await testManager
      .getErrorMessage({
        query: DELETE_MEET,
        variables: { id: meetId },
        cookies: [],
      })
      .then((errorMessage) => {
        expect(errorMessage).toMatch(/[(not |un)authorized]/i);
      });
  });

  it("gives an error message from validator when the id of the meet does not exist", async () => {
    await testManager
      .getErrorMessage({
        query: DELETE_MEET,
        variables: { id: "7fab763c-0bac-4ccc-b2b7-b8587104c10c" },
        cookies,
      })
      .then((errorMessage) => {
        expect(errorMessage).toMatch(/not exist/i);
      });
  });
});
