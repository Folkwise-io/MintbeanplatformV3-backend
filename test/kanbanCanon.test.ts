import { KanbanCanonCardStatusEnum, UpdateCardPositionInput } from "../src/types/gqlGeneratedTypes";
import { KANBAN_CANON_CARD_1, KANBAN_CANON_CARD_2 } from "./src/constants/kanbanCanonCardConstants";
import {
  CREATE_KANBAN_CANON_MUTATION,
  EDIT_KANBAN_CANON_INPUT,
  EDIT_KANBAN_CANON_MUTATION,
  GET_KANBAN_CANONS_QUERY,
  GET_KANBAN_CANON_QUERY,
  KANBAN_CANON_1_RAW,
  CREATE_KANBAN_CANON_1_RAW_INPUT,
  KANBAN_CANON_2_RAW,
  DELETE_KANBAN_CANON_MUTATION,
  UPDATE_KANBAN_CANON_CARD_POSITIONS_MUTATION,
} from "./src/constants/kanbanCanonConstants";
import TestManager from "./src/TestManager";
import { AMY, BOB } from "./src/constants/userConstants";
import { getAdminCookies, getBobCookies } from "./src/util";
import { ApolloErrorCodeEnum } from "./src/constants/errors";

const testManager = TestManager.build();

let adminCookies: string[];
let bobCookies: string[];

beforeAll(async () => {
  await testManager.deleteAllUsers();
  adminCookies = await getAdminCookies();
  bobCookies = await getBobCookies();
  await testManager.addUsers([AMY, BOB]);
});

beforeEach(async () => {
  await testManager.deleteAllMeets();
  await testManager.deleteAllKanbanCanons();
});

afterAll(async () => {
  await testManager.deleteAllMeets();
  await testManager.deleteAllKanbanCanons();
  await testManager.destroy();
});

describe("Querying kanbanCanons", () => {
  it("gets a kanbanCanon by id", async () => {
    await testManager
      .addKanbanCanons([KANBAN_CANON_1_RAW])
      .then(() =>
        testManager
          .getGraphQLResponse({ query: GET_KANBAN_CANON_QUERY, variables: { id: KANBAN_CANON_1_RAW.id } })
          .then(testManager.parseData),
      )
      .then(({ kanbanCanon }) => {
        expect(kanbanCanon).toMatchObject(KANBAN_CANON_1_RAW);
      });
  });
  it("gets all kanbanCanons", async () => {
    await testManager
      .addKanbanCanons([KANBAN_CANON_1_RAW, KANBAN_CANON_2_RAW])
      .then(() => testManager.getGraphQLResponse({ query: GET_KANBAN_CANONS_QUERY }).then(testManager.parseData))
      .then(({ kanbanCanons }) => {
        expect(kanbanCanons).toHaveLength(2);
      });
  });
  it("returns an empty array if there are no kanbanCanons", async () => {
    await testManager
      .getGraphQLResponse({ query: GET_KANBAN_CANONS_QUERY })
      .then(testManager.parseData)
      .then(({ kanbanCanons }) => {
        expect(kanbanCanons).toHaveLength(0);
      });
  });
});

describe("Creating kanbanCanons", () => {
  it("creates a kanbanCanon successfully when admin is logged in", async () => {
    await testManager
      .getGraphQLResponse({
        query: CREATE_KANBAN_CANON_MUTATION,
        variables: { input: CREATE_KANBAN_CANON_1_RAW_INPUT },
        cookies: adminCookies,
      })
      .then(testManager.parseData)
      .then(({ createKanbanCanon }) => {
        expect(createKanbanCanon).toMatchObject(CREATE_KANBAN_CANON_1_RAW_INPUT);
      });
  });
  it("throws 'not authorized' error if createKanbanSession is called while user not logged in", async () => {
    await testManager
      .getErrorCode({
        query: CREATE_KANBAN_CANON_MUTATION,
        variables: { input: CREATE_KANBAN_CANON_1_RAW_INPUT },
      })
      .then((errorCode) => {
        expect(errorCode).toBe(ApolloErrorCodeEnum.Unauthenticated);
      });
  });
  it("throws 'not authorized' error if createKanbanSession is called by non-admin user", async () => {
    await testManager
      .getErrorCode({
        query: CREATE_KANBAN_CANON_MUTATION,
        variables: { input: CREATE_KANBAN_CANON_1_RAW_INPUT },
        cookies: bobCookies,
      })
      .then((errorCode) => {
        expect(errorCode).toBe(ApolloErrorCodeEnum.Unauthenticated);
      });
  });
  it("returns an appropriate error message when a field is missing", async () => {
    const partialInput = { title: "A title" };
    await testManager
      .getErrorCode({
        query: CREATE_KANBAN_CANON_MUTATION,
        variables: { input: partialInput },
        cookies: adminCookies,
      })
      .then((errorCode) => {
        expect(errorCode).toBe(ApolloErrorCodeEnum.InternalServerError);
      });
  });
  it("returns an appropriate error message when a field is in wrong type", async () => {
    await testManager
      .getErrorCode({
        query: CREATE_KANBAN_CANON_MUTATION,
        variables: { input: { ...CREATE_KANBAN_CANON_1_RAW_INPUT, title: 100 } },
        cookies: adminCookies,
      })
      .then((errorMessage) => {
        expect(errorMessage).toBe(ApolloErrorCodeEnum.InternalServerError);
      });
  });
});

describe("Editing kanbanCanons", () => {
  beforeEach(async () => {
    await testManager.deleteAllKanbanCanons();
    await testManager.addKanbanCanons([KANBAN_CANON_1_RAW]);
  });
  it("updates a kanbanCanon with valid input when admin is logged in", async () => {
    await testManager
      .getGraphQLResponse({
        query: EDIT_KANBAN_CANON_MUTATION,
        variables: { id: KANBAN_CANON_1_RAW.id, input: EDIT_KANBAN_CANON_INPUT },
        cookies: adminCookies,
      })
      .then(testManager.parseData)
      .then(({ editKanbanCanon }) => {
        expect(editKanbanCanon.title).not.toBe(KANBAN_CANON_1_RAW.title);
        expect(editKanbanCanon.title).toBe(EDIT_KANBAN_CANON_INPUT.title);
      });
  });
  it("updates the updatedAt timestamp after editing a kanban canon", async () => {
    // Check that createdAt is initially equal to updatedAt
    await testManager
      .getGraphQLData({ query: GET_KANBAN_CANON_QUERY, variables: { id: KANBAN_CANON_1_RAW.id } })
      .then(({ kanbanCanon }) => expect(kanbanCanon.createdAt).toBe(kanbanCanon.updatedAt));

    await testManager
      .getGraphQLData({
        query: EDIT_KANBAN_CANON_MUTATION,
        variables: { id: KANBAN_CANON_1_RAW.id, input: EDIT_KANBAN_CANON_INPUT },
        cookies: adminCookies,
      })
      .then(({ editKanbanCanon }) => {
        expect(editKanbanCanon.createdAt < editKanbanCanon.updatedAt).toBe(true);
      });
  });

  it("returns an 'unauthorized' error message when editing a kanbanCanon without admin cookies", async () => {
    await testManager
      .getErrorCode({
        query: EDIT_KANBAN_CANON_MUTATION,
        variables: { id: KANBAN_CANON_1_RAW.id, input: EDIT_KANBAN_CANON_INPUT },
        cookies: [],
      })
      .then((errorCode) => {
        expect(errorCode).toMatch(ApolloErrorCodeEnum.Unauthenticated);
      });
  });

  it("gives an error message from validator when the id of the meet does not exist", async () => {
    await testManager
      .getErrorCode({
        query: EDIT_KANBAN_CANON_MUTATION,
        variables: { id: "7fab763c-0bac-4ccc-b2b7-b8587104c10c", input: EDIT_KANBAN_CANON_INPUT },
        cookies: adminCookies,
      })
      .then((errorCode) => {
        expect(errorCode).toMatch(ApolloErrorCodeEnum.InternalServerError);
      });
  });

  it("gives an error message when no edit fields are specified in the mutation", async () => {
    await testManager
      .getErrorCode({
        query: EDIT_KANBAN_CANON_MUTATION,
        variables: { id: KANBAN_CANON_1_RAW.id, input: {} },
        cookies: adminCookies,
      })
      .then((errorCode) => {
        expect(errorCode).toBe("BAD_USER_INPUT");
      });
  });

  it("gives an error message when trying to edit a non-existent field", async () => {
    await testManager
      .getErrorCode({
        query: EDIT_KANBAN_CANON_MUTATION,
        variables: { id: KANBAN_CANON_1_RAW.id, input: { nonexistent: "hello" } },
        cookies: adminCookies,
      })
      .then((errorCode) => {
        expect(errorCode).toBe(ApolloErrorCodeEnum.InternalServerError);
      });
  });

  it("gives an error message when trying to edit a field that exists in db but is not defined in schema", async () => {
    await testManager
      .getErrorCode({
        query: EDIT_KANBAN_CANON_MUTATION,
        variables: { id: KANBAN_CANON_1_RAW.id, input: { createdAt: "2020-11-12T23:43:08.348Z" } },
        cookies: adminCookies,
      })
      .then((errorCode) => {
        expect(errorCode).toBe(ApolloErrorCodeEnum.InternalServerError);
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
        query: UPDATE_KANBAN_CANON_CARD_POSITIONS_MUTATION,
        variables: { id: KANBAN_CANON_1_RAW.id, input },
        cookies: adminCookies,
      })
      .then(({ updateKanbanCanonCardPositions }) => {
        expect(updateKanbanCanonCardPositions).toMatchObject(expected);
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
        query: UPDATE_KANBAN_CANON_CARD_POSITIONS_MUTATION,
        variables: { id: KANBAN_CANON_1_RAW.id, input },
        cookies: adminCookies,
      })
      .then(({ updateKanbanCanonCardPositions }) => {
        expect(updateKanbanCanonCardPositions).toMatchObject(expected);
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
        query: UPDATE_KANBAN_CANON_CARD_POSITIONS_MUTATION,
        variables: { id: KANBAN_CANON_1_RAW.id, input },
        cookies: adminCookies,
      })
      .then(({ updateKanbanCanonCardPositions }) => {
        expect(updateKanbanCanonCardPositions).toMatchObject(expected);
      });
  });
  it("throws an authentication error if non-admin attempts to update card positions", async () => {
    const input: UpdateCardPositionInput = {
      cardId: KANBAN_CANON_CARD_1.id,
      status: KanbanCanonCardStatusEnum.Wip,
      index: 0,
    };

    await testManager
      .getErrorCode({
        query: UPDATE_KANBAN_CANON_CARD_POSITIONS_MUTATION,
        variables: { id: KANBAN_CANON_1_RAW.id, input },
        cookies: bobCookies,
      })
      .then((errorCode) => {
        expect(errorCode).toBe(ApolloErrorCodeEnum.Unauthenticated);
      });
  });
});
