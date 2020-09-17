import { Meet } from "../src/types/gqlGeneratedTypes";
import {
  ALGOLIA,
  CREATE_MEET,
  EDIT_MEET,
  EDIT_MEET_INPUT,
  GET_ALL_MEETS,
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

describe("Creating meets", () => {
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

describe("Editing meets", () => {
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

  it("handles when no edit fields are specified", async () => {
    await testManager
      .getGraphQLData({
        query: EDIT_MEET,
        variables: { id: meetId, input: {} },
        cookies,
      })
      .then(({ editMeet }) => {
        expect(editMeet).toMatchObject(NEW_MEET_INPUT);
      });
  });
});
