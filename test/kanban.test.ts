import { KanbanSessionRaw } from "../src/dao/KanbanDao";
import { KanbanCanonCardStatusEnum, UpdateCardPositionInput } from "../src/types/gqlGeneratedTypes";
import { KANBAN_CANON_CARD_1, KANBAN_CANON_CARD_2 } from "./src/kanbanCanonCardConstants";
import { KANBAN_CANON_1_RAW, KANBAN_CANON_2_RAW } from "./src/kanbanCanonConstants";
import {
  CREATE_ISOLATED_KANBAN_INPUT,
  CREATE_KANBAN_MUTATION,
  DELETE_KANBAN_MUTATION,
  GET_KANBANS_QUERY,
  GET_KANBAN_QUERY,
  ISOLATED_KANBAN_RAW_1,
  MEET_KANBAN_RAW_1,
  MEET_KANBAN_RAW_2,
  UPDATE_KANBAN_CARD_POSITIONS_MUTATION,
} from "./src/kanbanConstants";
import { GET_MEET_QUERY, PAPERJS } from "./src/meetConstants";
import TestManager from "./src/TestManager";
import { AMY, BOB, DORTHY } from "./src/userConstants";
import { getAdminCookies, getBobCookies, getDorthyCookies } from "./src/util";

const testManager = TestManager.build();

const SEEDED_KANBAN_CANON_CARDS = [
  { ...KANBAN_CANON_CARD_1, kanbanCanonId: KANBAN_CANON_1_RAW.id },
  { ...KANBAN_CANON_CARD_2, kanbanCanonId: KANBAN_CANON_1_RAW.id },
];

const PAPERJS_WITH_KANBAN_CANON_1_RAW = { ...PAPERJS, kanbanCanonId: KANBAN_CANON_1_RAW.id };
let adminCookies: string[];
let bobCookies: string[];
let dorthyCookies: string[];

beforeAll(async () => {
  await testManager.deleteAllUsers();
  adminCookies = await getAdminCookies();
  bobCookies = await getBobCookies();
  dorthyCookies = await getDorthyCookies();
  await testManager.addUsers([AMY, BOB, DORTHY]);
});

beforeEach(async () => {
  await testManager.deleteAllMeets();
  await testManager.deleteAllKanbanCanons(); // deletes cards by CASCADE

  await testManager.addKanbanCanons([KANBAN_CANON_1_RAW, KANBAN_CANON_2_RAW]); // KANBAN_CANON_1_RAW is the base for MEET_KANBAN_RAW_1 and 2, KANBAN_CANON_2_RAW is base for isolated kanban
  await testManager.addKanbanCanonCards(SEEDED_KANBAN_CANON_CARDS); // for KANBAN_CANON_1_RAW
  await testManager.addMeets([PAPERJS_WITH_KANBAN_CANON_1_RAW]);
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
  it("returns kanban on meet with kanbanCanonId of requesting user, if exists", async () => {
    await testManager
      .addKanbans([{ ...MEET_KANBAN_RAW_1, meetId: PAPERJS_WITH_KANBAN_CANON_1_RAW.id }])
      .then(() =>
        testManager
          .getGraphQLResponse({
            query: GET_MEET_QUERY,
            variables: {
              id: PAPERJS_WITH_KANBAN_CANON_1_RAW.id,
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
          id: PAPERJS_WITH_KANBAN_CANON_1_RAW.id,
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
    const partialInput = { kanbanCanonId: KANBAN_CANON_1_RAW.id };
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

describe("Deleting kanbans", () => {
  beforeEach(async () => {
    await testManager.deleteAllKanbans();
    await testManager.addKanbans([ISOLATED_KANBAN_RAW_1]);
  });

  it("deletes a kanban successfully when owner requests deletion", async () => {
    await testManager
      .getGraphQLData({ query: GET_KANBANS_QUERY, cookies: adminCookies })
      .then(({ kanbans }) => expect(kanbans).toHaveLength(1));

    await testManager
      .getGraphQLData({
        query: DELETE_KANBAN_MUTATION,
        variables: { id: ISOLATED_KANBAN_RAW_1.id },
        cookies: bobCookies,
      })
      .then(({ deleteKanban }) => {
        expect(deleteKanban).toBe(true);
      });

    await testManager
      .getGraphQLData({ query: GET_KANBANS_QUERY, cookies: adminCookies })
      .then(({ kanbans }) => expect(kanbans).toHaveLength(0));
  });
  it("allows an admin to delete a kanban of another users", async () => {
    await testManager
      .getGraphQLData({
        query: DELETE_KANBAN_MUTATION,
        variables: { id: ISOLATED_KANBAN_RAW_1.id },
        cookies: adminCookies,
      })
      .then(({ deleteKanban }) => {
        expect(deleteKanban).toBe(true);
      });
  });
  it("returns an 'unauthorized' error message when deleting a kanban owned by another user without admin cookies", async () => {
    await testManager.addKanbans([MEET_KANBAN_RAW_2]); // owned by Dorthy
    await testManager
      .getErrorMessage({
        query: DELETE_KANBAN_MUTATION,
        variables: { id: MEET_KANBAN_RAW_2.id },
        cookies: bobCookies,
      })
      .then((errorMessage) => {
        expect(errorMessage).toMatch(/[(not |un)authorized]/i);
      });
  });

  it("gives an error message from validator when the id of the meet does not exist", async () => {
    await testManager
      .getErrorMessage({
        query: DELETE_KANBAN_MUTATION,
        variables: { id: "7fab763c-0bac-4ccc-b2b7-b8587104c10c" },
        cookies: bobCookies,
      })
      .then((errorMessage) => {
        expect(errorMessage).toMatch(/not exist/i);
      });
  });
});

describe("Updating card positions", () => {
  beforeEach(async () => {
    await testManager.deleteAllKanbanCanons();
    const KANBAN_CANON_CARDS = [KANBAN_CANON_CARD_1, KANBAN_CANON_CARD_2];
    const INITIAL_CARD_POSITIONS = {
      todo: KANBAN_CANON_CARDS.map((kcc) => kcc.id),
      wip: [],
      done: [],
    };
    await testManager.addKanbanCanons([{ ...KANBAN_CANON_1_RAW, cardPositions: INITIAL_CARD_POSITIONS }]);
    await testManager.addKanbanCanonCards(KANBAN_CANON_CARDS);
    await testManager.addKanbans([{ ...ISOLATED_KANBAN_RAW_1, kanbanCanonId: KANBAN_CANON_1_RAW.id }]);
  });
  it("successfully updates card positions when new status and index provided for a card", async () => {
    const input: UpdateCardPositionInput = {
      cardId: KANBAN_CANON_CARD_1.id,
      status: KanbanCanonCardStatusEnum.Wip,
      index: 0,
    };
    const expected = {
      todo: [KANBAN_CANON_CARD_2.id],
      wip: [KANBAN_CANON_CARD_1.id],
      done: [],
    };
    await testManager
      .getGraphQLData({
        query: UPDATE_KANBAN_CARD_POSITIONS_MUTATION,
        variables: { id: ISOLATED_KANBAN_RAW_1.id, input },
        cookies: bobCookies,
      })
      .then(({ updateKanbanCardPositions }) => {
        expect(updateKanbanCardPositions).toMatchObject(expected);
      });
  });
  it("successfully updates card positions when same status yet new index provided for a card", async () => {
    const input: UpdateCardPositionInput = {
      cardId: KANBAN_CANON_CARD_1.id,
      status: KanbanCanonCardStatusEnum.Todo,
      index: 1,
    };
    const expected = {
      todo: [KANBAN_CANON_CARD_2.id, KANBAN_CANON_CARD_1.id],
      wip: [],
      done: [],
    };
    await testManager
      .getGraphQLData({
        query: UPDATE_KANBAN_CARD_POSITIONS_MUTATION,
        variables: { id: ISOLATED_KANBAN_RAW_1.id, input },
        cookies: bobCookies,
      })
      .then(({ updateKanbanCardPositions }) => {
        expect(updateKanbanCardPositions).toMatchObject(expected);
      });
  });
  it("gracefully handles a bogus new index", async () => {
    const input: UpdateCardPositionInput = {
      cardId: KANBAN_CANON_CARD_1.id,
      status: KanbanCanonCardStatusEnum.Todo,
      index: 100,
    };
    const expected = {
      todo: [KANBAN_CANON_CARD_2.id, KANBAN_CANON_CARD_1.id],
      wip: [],
      done: [],
    };
    await testManager
      .getGraphQLData({
        query: UPDATE_KANBAN_CARD_POSITIONS_MUTATION,
        variables: { id: ISOLATED_KANBAN_RAW_1.id, input },
        cookies: bobCookies,
      })
      .then(({ updateKanbanCardPositions }) => {
        expect(updateKanbanCardPositions).toMatchObject(expected);
      });
  });
  it("throws an authentication error if non-owner attempts to update card positions", async () => {
    const input: UpdateCardPositionInput = {
      cardId: KANBAN_CANON_CARD_1.id,
      status: KanbanCanonCardStatusEnum.Wip,
      index: 0,
    };

    await testManager
      .getErrorMessage({
        query: UPDATE_KANBAN_CARD_POSITIONS_MUTATION,
        variables: { id: ISOLATED_KANBAN_RAW_1.id, input },
        cookies: dorthyCookies,
      })
      .then((errorMessage) => {
        expect(errorMessage).toMatch(/[(not |un)]authorized/);
      });
  });
});
