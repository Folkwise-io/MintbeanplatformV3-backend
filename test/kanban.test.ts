import { KanbanSessionRaw } from "../src/dao/KanbanDao";
import { KANBAN_CANON_CARD_1, KANBAN_CANON_CARD_2 } from "./src/kanbanCanonCardConstants";
import { KANBAN_CANON_1, KANBAN_CANON_2 } from "./src/kanbanCanonConstants";
import {
  GET_KANBANS_QUERY,
  GET_KANBAN_QUERY,
  ISOLATED_KANBAN_RAW_1,
  MEET_KANBAN_RAW_1,
  MEET_KANBAN_RAW_2,
} from "./src/kanbanConstants";
import { PAPERJS } from "./src/meetConstants";
import TestManager from "./src/TestManager";
import { AMY, BOB, DORTHY } from "./src/userConstants";
import { getAdminCookies, getBobCookies } from "./src/util";

const testManager = TestManager.build();

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
  await testManager.addKanbanCanonCards([KANBAN_CANON_CARD_1, KANBAN_CANON_CARD_2]); // for KANBAN_CANON_1
  await testManager.addMeets([PAPERJS]); // for KANBAN_CANON_1
});

afterAll(async () => {
  await testManager.deleteAllMeets();
  await testManager.deleteAllKanbanCanons();
  await testManager.deleteAllUsers();
  await testManager.destroy();
});

describe("Querying kanbans", () => {
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
      .addKanbans([{ ...MEET_KANBAN_RAW_1 }])
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
