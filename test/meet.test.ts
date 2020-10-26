import { nDaysAndHoursFromNowInWallClockTime } from "../src/util/timeUtils";
import { Meet, RegisterLinkStatus } from "../src/types/gqlGeneratedTypes";
import {
  ALGOLIA,
  CREATE_MEET,
  DELETE_MEET,
  EDIT_MEET,
  EDIT_MEET_INPUT,
  GET_ALL_MEETS,
  GET_MEETS_BY_ID,
  GET_REGISTERLINK_STATUS,
  NEW_MEET_INPUT,
  PAPERJS,
} from "./src/meetConstants";
import TestManager from "./src/TestManager";
import { getAdminCookies } from "./src/util";
import { KANBAN_CANON_1 } from "./src/kanbanCanonConstants";

const testManager = TestManager.build();

beforeEach(async () => {
  await testManager.deleteAllMeets();
  await testManager.deleteAllKanbanCanons();
});

afterAll(async () => {
  await testManager.deleteAllMeets();
  await testManager.deleteAllUsers();
  await testManager.deleteAllKanbanCanons();
  await testManager.destroy();
});

describe("Querying meets", () => {
  it("gets a meet by id", async () => {
    await testManager
      .addMeets([PAPERJS])
      .then(() =>
        testManager
          .getGraphQLResponse({ query: GET_MEETS_BY_ID, variables: { id: PAPERJS.id } })
          .then(testManager.parseData),
      )
      .then(({ meet }) => {
        expect(meet).toMatchObject(PAPERJS);
      });
  });
  it("gets a meet by id with kanbanCanon if provided", async () => {
    const MEET_WITH_KANBAN_CANON = { ...PAPERJS, kanbanCanonId: KANBAN_CANON_1.id };
    await testManager.addKanbanCanons([KANBAN_CANON_1]);
    await testManager
      .addMeets([MEET_WITH_KANBAN_CANON])
      .then(() =>
        testManager
          .getGraphQLResponse({ query: GET_MEETS_BY_ID, variables: { id: PAPERJS.id } })
          .then(testManager.parseData),
      )
      .then(({ meet }) => {
        expect(meet).toMatchObject(MEET_WITH_KANBAN_CANON);
        expect(meet.kanbanCanonId).toBe(MEET_WITH_KANBAN_CANON.kanbanCanonId);
        expect(meet.kanbanCanon).not.toBe(null);
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

describe("Deleting meets", () => {
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

describe("Getting the registerLink and registerLinkStatus", () => {
  it("returns register link of null and status of closed if meet has ended", async () => {
    const pastMeet: Meet = {
      ...ALGOLIA,
      startTime: nDaysAndHoursFromNowInWallClockTime(-4),
      endTime: nDaysAndHoursFromNowInWallClockTime(-3),
    };

    await testManager.addMeets([pastMeet]);
    await testManager
      .getGraphQLData({ query: GET_REGISTERLINK_STATUS, variables: { id: pastMeet.id } })
      .then(({ meet }) => {
        expect(meet.registerLink).toBe(null);
        expect(meet.registerLinkStatus).toBe(RegisterLinkStatus.Closed);
      });
  });

  it("returns a good register link and status of waiting if meet has not started", async () => {
    const futureMeet: Meet = {
      ...ALGOLIA,
      startTime: nDaysAndHoursFromNowInWallClockTime(2),
      endTime: nDaysAndHoursFromNowInWallClockTime(3),
      region: Intl.DateTimeFormat().resolvedOptions().timeZone,
    };

    await testManager.addMeets([futureMeet]);
    await testManager
      .getGraphQLData({ query: GET_REGISTERLINK_STATUS, variables: { id: futureMeet.id } })
      .then(({ meet }) => {
        expect(meet.registerLink).toBe(ALGOLIA.registerLink);
        expect(meet.registerLinkStatus).toBe(RegisterLinkStatus.Waiting);
      });
  });

  it("returns a good register link and status of open if meet is in progress", async () => {
    const currentMeet: Meet = {
      ...ALGOLIA,
      startTime: nDaysAndHoursFromNowInWallClockTime(0, -1),
      endTime: nDaysAndHoursFromNowInWallClockTime(0, 1),
      region: Intl.DateTimeFormat().resolvedOptions().timeZone,
    };
    await testManager.addMeets([currentMeet]);
    await testManager
      .getGraphQLData({ query: GET_REGISTERLINK_STATUS, variables: { id: currentMeet.id } })
      .then(({ meet }) => {
        expect(meet.registerLink).toBe(ALGOLIA.registerLink);
        expect(meet.registerLinkStatus).toBe(RegisterLinkStatus.Open);
      });
  });
});
