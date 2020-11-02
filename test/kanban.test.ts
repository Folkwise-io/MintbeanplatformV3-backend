import { KanbanSessionRaw } from "../src/dao/KanbanDao";
import { KANBAN_CANON_CARD_1, KANBAN_CANON_CARD_2 } from "./src/kanbanCanonCardConstants";
import { KANBAN_CANON_1, KANBAN_CANON_2 } from "./src/kanbanCanonConstants";
import {
  CREATE_ISOLATED_KANBAN_INPUT,
  CREATE_KANBAN_MUTATION,
  GET_KANBANS_QUERY,
  GET_KANBAN_QUERY,
  ISOLATED_KANBAN_RAW_1,
  MEET_KANBAN_RAW_1,
  MEET_KANBAN_RAW_2,
} from "./src/kanbanConstants";
import { GET_MEET_QUERY, PAPERJS } from "./src/meetConstants";
import TestManager from "./src/TestManager";
import { AMY, BOB, DORTHY } from "./src/userConstants";
import { getAdminCookies, getBobCookies } from "./src/util";

const testManager = TestManager.build();

const SEEDED_KANBAN_CANON_CARDS = [KANBAN_CANON_CARD_1, KANBAN_CANON_CARD_2];
const PAPERJS_WITH_KANBAN_CANON_1 = { ...PAPERJS, kanbanCanonId: KANBAN_CANON_1.id };
let adminCookies: string[];
let bobCookies: string[];

beforeAll(async () => {
  await testManager.deleteAllUsers();
  adminCookies = await getAdminCookies();
  bobCookies = await getBobCookies();
  await testManager.addUsers([AMY, BOB, DORTHY]);
});

beforeEach(async () => {
  await testManager.deleteAllMeets();
  await testManager.deleteAllKanbanCanons(); // deletes cards by CASCADE

  await testManager.addKanbanCanons([KANBAN_CANON_1, KANBAN_CANON_2]); // KANBAN_CANON_1 is the base for MEET_KANBAN_RAW_1 and 2
  await testManager.addKanbanCanonCards(SEEDED_KANBAN_CANON_CARDS); // for KANBAN_CANON_1
  await testManager.addMeets([PAPERJS_WITH_KANBAN_CANON_1]);
});

afterAll(async () => {
  await testManager.deleteAllMeets();
  await testManager.deleteAllKanbanCanons();
  await testManager.deleteAllUsers();
  await testManager.destroy();
});

describe("Querying kanbans", () => {
  beforeEach(async () => {
    await testManager.deleteAllMeets();
    await testManager.deleteAllKanbanCanons(); // deletes cards by CASCADE

    await testManager.addKanbanCanons([KANBAN_CANON_1, KANBAN_CANON_2]); // KANBAN_CANON_1 is the base for MEET_KANBAN_RAW_1 and 2
    await testManager.addKanbanCanonCards(SEEDED_KANBAN_CANON_CARDS); // for KANBAN_CANON_1
    await testManager.addMeets([PAPERJS_WITH_KANBAN_CANON_1]);
  });

  it("gets a kanban by id when logged in user matches kanban owner", async () => {
    await testManager
      .addKanbans([MEET_KANBAN_RAW_1])
      .then(() =>
        testManager
          .getGraphQLResponse({
            query: GET_KANBAN_QUERY,
            variables: { id: MEET_KANBAN_RAW_1.id },
            cookies: bobCookies,
          })
          .then(testManager.parseData),
      )
      .then(({ kanban }) => {
        expect(kanban).toMatchObject(MEET_KANBAN_RAW_1);
        expect(kanban.kanbanCards).toHaveLength(2);
      });
  });
  it("gets an isolated kanban by composite args when logged in user matches kanban owner", async () => {
    await testManager
      .addKanbans([ISOLATED_KANBAN_RAW_1])
      .then(() =>
        testManager
          .getGraphQLResponse({
            query: GET_KANBAN_QUERY,
            variables: {
              kanbanCanonId: ISOLATED_KANBAN_RAW_1.kanbanCanonId,
              userId: ISOLATED_KANBAN_RAW_1.userId,
            },
            cookies: bobCookies,
          })
          .then(testManager.parseData),
      )
      .then(({ kanban }) => {
        expect(kanban).toMatchObject(ISOLATED_KANBAN_RAW_1);
      });
  });
  it("gets a meet kanban by composite args when logged in user matches kanban owner", async () => {
    await testManager
      .addKanbans([MEET_KANBAN_RAW_1])
      .then(() =>
        testManager
          .getGraphQLResponse({
            query: GET_KANBAN_QUERY,
            variables: {
              kanbanCanonId: MEET_KANBAN_RAW_1.kanbanCanonId,
              userId: MEET_KANBAN_RAW_1.userId,
              meetId: MEET_KANBAN_RAW_1.meetId,
            },
            cookies: bobCookies,
          })
          .then(testManager.parseData),
      )
      .then(({ kanban }) => {
        expect(kanban).toMatchObject(MEET_KANBAN_RAW_1);
      });
  });
  it("returns kanban on meet with kanbanCanonId of requesting user, if exists", async () => {
    await testManager
      .addKanbans([{ ...MEET_KANBAN_RAW_1, meetId: PAPERJS_WITH_KANBAN_CANON_1.id }])
      .then(() =>
        testManager
          .getGraphQLResponse({
            query: GET_MEET_QUERY,
            variables: {
              id: PAPERJS_WITH_KANBAN_CANON_1.id,
            },
            cookies: bobCookies,
          })
          .then(testManager.parseData),
      )
      .then(({ meet }) => {
        expect(meet.kanban).toMatchObject(MEET_KANBAN_RAW_1);
        expect(meet.kanban.userId).toMatch(BOB.id);
      });
  });
  it("returns kanban: null on meet where requesting user does not have a kanban", async () => {
    await testManager
      .getGraphQLResponse({
        query: GET_MEET_QUERY,
        variables: {
          id: PAPERJS_WITH_KANBAN_CANON_1.id,
        },
        cookies: bobCookies,
      })
      .then(testManager.parseData)
      .then(({ meet }) => {
        expect(meet.kanban).toBe(null);
      });
  });
  it("throws a 'not authorized' error if currently logged in user tries to get a kanban they don't own by id", async () => {
    await testManager
      .addKanbans([{ ...MEET_KANBAN_RAW_1, userId: DORTHY.id }])
      .then(() =>
        testManager.getErrorMessage({
          query: GET_KANBAN_QUERY,
          variables: { id: MEET_KANBAN_RAW_1.id },
          cookies: bobCookies,
        }),
      )
      .then((errorMessage) => {
        expect(errorMessage).toMatch(/[(not |un)authorized]/i);
      });
  });
  it("gets a kanban by id for another user if logged in as admin", async () => {
    await testManager
      .addKanbans([{ ...MEET_KANBAN_RAW_1 }])
      .then(() =>
        testManager
          .getGraphQLResponse({
            query: GET_KANBAN_QUERY,
            variables: { id: MEET_KANBAN_RAW_1.id },
            cookies: adminCookies,
          })
          .then(testManager.parseData),
      )
      .then(({ kanban }) => {
        expect(kanban).toMatchObject(MEET_KANBAN_RAW_1);
      });
  });
  it("throws an error if an admin attempts to retrieve a kanban without enough args", async () => {
    await testManager
      .addKanbans([MEET_KANBAN_RAW_1])
      .then(() =>
        testManager.getErrorMessage({
          query: GET_KANBAN_QUERY,
          variables: { kanbanCanonId: MEET_KANBAN_RAW_1.kanbanCanonId },
          cookies: adminCookies,
        }),
      )
      .then((errorMessage) => {
        expect(errorMessage).toMatch("must provide");
      });
  });
  // TODO: why can you get this when no cookies passed?
  it("gets all kanbans on a meet by meetId for admin", async () => {
    await testManager
      .addKanbans([MEET_KANBAN_RAW_1, MEET_KANBAN_RAW_2])
      .then(() =>
        testManager
          .getGraphQLResponse({
            query: GET_KANBANS_QUERY,
            variables: { meetId: MEET_KANBAN_RAW_1.meetId },
            cookies: adminCookies,
          })
          .then(testManager.parseData),
      )
      .then(({ kanbans }) => {
        expect(kanbans).toHaveLength(2);
      });
  });

  it("gets all kanbans for a kanbanCanon by kanbanCanonId for admin", async () => {
    const twoKanbans = [MEET_KANBAN_RAW_1, ISOLATED_KANBAN_RAW_1];
    // ensure they share a kanbanCanonId
    const kanbansWithSameCanon: KanbanSessionRaw[] = twoKanbans.map((k) => ({
      ...k,
      kanbanCanonId: MEET_KANBAN_RAW_1.kanbanCanonId,
    }));
    await testManager
      .addKanbans(kanbansWithSameCanon)
      .then(() =>
        testManager
          .getGraphQLResponse({
            query: GET_KANBANS_QUERY,
            variables: { kanbanCanonId: MEET_KANBAN_RAW_1.kanbanCanonId },
            cookies: adminCookies,
          })
          .then(testManager.parseData),
      )
      .then(({ kanbans }) => {
        expect(kanbans).toHaveLength(2);
      });
  });
  it("does not get deleted kanbans", async () => {
    await testManager
      .addKanbans([{ ...MEET_KANBAN_RAW_1, deleted: true } as any])
      .then(() =>
        testManager
          .getGraphQLResponse({
            query: GET_KANBANS_QUERY,
            variables: { meetId: MEET_KANBAN_RAW_1.meetId },
            cookies: adminCookies,
          })
          .then(testManager.parseData),
      )
      .then(({ kanbans }) => {
        expect(kanbans).toHaveLength(0);
      });
  });
  it("gets all kanbans for a user by userId if user is kanban owner", async () => {
    await testManager
      .addKanbans([MEET_KANBAN_RAW_1, ISOLATED_KANBAN_RAW_1])
      .then(() =>
        testManager
          .getGraphQLResponse({
            query: GET_KANBANS_QUERY,
            variables: { userId: MEET_KANBAN_RAW_1.userId },
            cookies: bobCookies,
          })
          .then(testManager.parseData),
      )
      .then(({ kanbans }) => {
        expect(kanbans).toHaveLength(2);
      });
  });
  it("gets all kanbans for a user by userId if user is kanban owner", async () => {
    await testManager
      .addKanbans([MEET_KANBAN_RAW_1, ISOLATED_KANBAN_RAW_1])
      .then(() =>
        testManager
          .getGraphQLResponse({
            query: GET_KANBANS_QUERY,
            variables: { userId: MEET_KANBAN_RAW_1.userId },
            cookies: bobCookies,
          })
          .then(testManager.parseData),
      )
      .then(({ kanbans }) => {
        expect(kanbans).toHaveLength(2);
      });
  });
  it("throws a 'not authorized' error if a non-admin user attempts to get all kanbans", async () => {
    await testManager
      .addKanbans([MEET_KANBAN_RAW_1, MEET_KANBAN_RAW_2])
      .then(() =>
        testManager.getErrorMessage({
          query: GET_KANBANS_QUERY,
          variables: { meetId: MEET_KANBAN_RAW_1.meetId },
          cookies: bobCookies,
        }),
      )
      .then((errorMessage) => {
        expect(errorMessage).toMatch(/[(not |un)authorized]/);
      });
  });
  it("returns an empty array if there are no kanbans", async () => {
    await testManager
      .getGraphQLResponse({
        query: GET_KANBANS_QUERY,
        variables: { meetId: MEET_KANBAN_RAW_1.meetId },
        cookies: adminCookies,
      })
      .then(testManager.parseData)
      .then(({ kanbans }) => {
        expect(kanbans).toHaveLength(0);
      });
  });
});

describe("Creating kanbans", () => {
  it("creates an isolated kanban successfully", async () => {
    await testManager
      .getGraphQLResponse({
        query: CREATE_KANBAN_MUTATION,
        variables: { input: CREATE_ISOLATED_KANBAN_INPUT },
        cookies: bobCookies,
      })
      .then(testManager.parseData)
      .then(({ createKanban }) => {
        expect(createKanban).toMatchObject(CREATE_ISOLATED_KANBAN_INPUT);
      });
  });
  it("creates a meet kanban successfully", async () => {
    await testManager
      .getGraphQLResponse({
        query: CREATE_KANBAN_MUTATION,
        variables: { input: { ...CREATE_ISOLATED_KANBAN_INPUT, meetId: PAPERJS.id } },
        cookies: bobCookies,
      })
      .then(testManager.parseData)
      .then(({ createKanban }) => {
        expect(createKanban).toMatchObject(CREATE_ISOLATED_KANBAN_INPUT);
      });
  });
  it("throws 'not authorized' user attempts to create kanban while not logged in", async () => {
    await testManager
      .getErrorMessage({
        query: CREATE_KANBAN_MUTATION,
        variables: { input: CREATE_ISOLATED_KANBAN_INPUT },
        cookies: [],
      })
      .then((errorMessage) => {
        expect(errorMessage).toMatch(/log(ged)? in/i);
      });
  });
  it("allows admin to create a kanban on behalf of another user", async () => {
    await testManager
      .getGraphQLResponse({
        query: CREATE_KANBAN_MUTATION,
        variables: { input: { ...CREATE_ISOLATED_KANBAN_INPUT, userId: BOB.id } },
        cookies: adminCookies,
      })
      .then(testManager.parseData)
      .then(({ createKanban }) => {
        expect(createKanban).toMatchObject(CREATE_ISOLATED_KANBAN_INPUT);
      });
  });
  it("throws 'not authorized' error if non-admin user attempts to create a kanban on behalf of another user", async () => {
    await testManager
      .getErrorMessage({
        query: CREATE_KANBAN_MUTATION,
        variables: { input: { ...CREATE_ISOLATED_KANBAN_INPUT, userId: DORTHY.id } },
        cookies: bobCookies,
      })
      .then((errorMessage) => {
        expect(errorMessage).toMatch(/[(cannot | can't)] create kanban/i);
      });
  });
  it("returns an appropriate error message when a required field is missing", async () => {
    const partialInput = { kanbanCanonId: KANBAN_CANON_1.id };
    await testManager
      .getErrorMessage({
        query: CREATE_KANBAN_MUTATION,
        variables: { input: partialInput },
        cookies: bobCookies,
      })
      .then((errorMessage) => {
        expect(errorMessage).toMatch(/userId/i);
      });
  });
  it("returns an appropriate error message when a field is in wrong type", async () => {
    await testManager
      .getErrorMessage({
        query: CREATE_KANBAN_MUTATION,
        variables: { input: { ...CREATE_ISOLATED_KANBAN_INPUT, kanbanCanonId: 100 } },
        cookies: bobCookies,
      })
      .then((errorMessage) => {
        expect(errorMessage).toMatch(/kanbanCanonId/i);
      });
  });
});
