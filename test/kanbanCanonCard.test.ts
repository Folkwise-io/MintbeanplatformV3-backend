import {
  CREATE_KANBAN_CANON_CARD_MUTATION,
  GET_KANBAN_CANON_CARDS_QUERY,
  GET_KANBAN_CANON_CARD_QUERY,
  KANBAN_CANON_CARD_1,
  CREATE_KANBAN_CANON_CARD_1_INPUT,
  KANBAN_CANON_CARD_2,
  EDIT_KANBAN_CANON_CARD_MUTATION,
  EDIT_KANBAN_CANON_CARD_INPUT,
  DELETE_KANBAN_CANON_CARD_MUTATION,
  KANBAN_CANON_CARD_3,
} from "./src/kanbanCanonCardConstants";
import { GET_KANBAN_CANON_QUERY, KANBAN_CANON_1_RAW, KANBAN_CANON_2_RAW } from "./src/kanbanCanonConstants";
import TestManager from "./src/TestManager";
import { getAdminCookies } from "./src/util";

const testManager = TestManager.build();
let adminCookies: string[];

beforeAll(async () => {
  adminCookies = await getAdminCookies();
});

beforeEach(async () => {
  await testManager.deleteAllMeets();
  await testManager.deleteAllKanbanCanons(); // Deletes kanbanCanonCards on CASCADE

  await testManager.addKanbanCanons([KANBAN_CANON_1_RAW]);
});

afterAll(async () => {
  await testManager.deleteAllMeets();
  await testManager.deleteAllKanbanCanons();
  await testManager.destroy();
});

describe("Querying kanbanCanonCards", () => {
  it("gets a kanbanCanonCard by id", async () => {
    await testManager
      .addKanbanCanonCards([KANBAN_CANON_CARD_1])
      .then(() =>
        testManager
          .getGraphQLResponse({ query: GET_KANBAN_CANON_CARD_QUERY, variables: { id: KANBAN_CANON_CARD_1.id } })
          .then(testManager.parseData),
      )
      .then(({ kanbanCanonCard }) => {
        expect(kanbanCanonCard).toMatchObject(KANBAN_CANON_CARD_1);
      });
  });
  it("gets all kanbanCanonCards on a kanbanCanon", async () => {
    await testManager
      .addKanbanCanonCards([KANBAN_CANON_CARD_1, KANBAN_CANON_CARD_2])
      .then(() =>
        testManager
          .getGraphQLResponse({
            query: GET_KANBAN_CANON_CARDS_QUERY,
            variables: { kanbanCanonId: KANBAN_CANON_1_RAW.id },
          })
          .then(testManager.parseData),
      )
      .then(({ kanbanCanonCards }) => {
        expect(kanbanCanonCards).toHaveLength(2);
      });
  });
  it("returns an empty array if there are no kanbanCanonCards", async () => {
    await testManager
      .getGraphQLResponse({ query: GET_KANBAN_CANON_CARDS_QUERY, variables: { kanbanCanonId: KANBAN_CANON_1_RAW.id } })
      .then(testManager.parseData)
      .then(({ kanbanCanonCards }) => {
        expect(kanbanCanonCards).toHaveLength(0);
      });
  });
  it("throws an error if requested kanban canon card does not exist", async () => {
    await testManager
      .getErrorMessage({ query: GET_KANBAN_CANON_CARD_QUERY, variables: { id: KANBAN_CANON_CARD_1.id } })
      .then((errorMessage) => {
        expect(errorMessage).toMatch(/not exist/i);
      });
  });
  it("throws an error if requested kanban canon does not exist", async () => {
    await testManager
      .getErrorMessage({ query: GET_KANBAN_CANON_CARDS_QUERY, variables: { kanbanCanonId: KANBAN_CANON_2_RAW.id } })
      .then((errorMessage) => {
        expect(errorMessage).toMatch(/not exist/i);
      });
  });
  it("throws an error if requested kanban canon card has been deleted", async () => {
    await testManager.addKanbanCanonCards([{ ...KANBAN_CANON_CARD_1, deleted: true } as any]);
    await testManager
      .getErrorMessage({ query: GET_KANBAN_CANON_CARD_QUERY, variables: { id: KANBAN_CANON_CARD_1.id } })
      .then((errorMessage) => {
        expect(errorMessage).toMatch(/not exist/i);
      });
  });
  it("does not retrieve deleted kanbanCanonCards", async () => {
    await testManager.addKanbanCanonCards([{ ...KANBAN_CANON_CARD_1, deleted: true } as any]);
    await testManager
      .getGraphQLResponse({ query: GET_KANBAN_CANON_CARDS_QUERY, variables: { kanbanCanonId: KANBAN_CANON_1_RAW.id } })
      .then(testManager.parseData)
      .then(({ kanbanCanonCards }) => {
        expect(kanbanCanonCards).toHaveLength(0);
      });
  });
});

describe("Creating kanbanCanonCards", () => {
  it("creates a kanbanCanonCard successfully and updates kanbanCanon's cardPositions array when admin is logged in", async () => {
    // adds card to db
    let newKanbanCanonCardId: string;
    await testManager
      .getGraphQLResponse({
        query: CREATE_KANBAN_CANON_CARD_MUTATION,
        variables: { input: CREATE_KANBAN_CANON_CARD_1_INPUT },
        cookies: adminCookies,
      })
      .then(testManager.parseData)
      .then(({ createKanbanCanonCard }) => {
        newKanbanCanonCardId = createKanbanCanonCard.id;
        expect(createKanbanCanonCard).toMatchObject(CREATE_KANBAN_CANON_CARD_1_INPUT);
      });
    // updates kanbanCanon's id array
    await testManager
      .getGraphQLResponse({
        query: GET_KANBAN_CANON_QUERY,
        variables: { id: CREATE_KANBAN_CANON_CARD_1_INPUT.kanbanCanonId },
        cookies: adminCookies,
      })
      .then(testManager.parseData)
      .then(({ kanbanCanon }) => {
        expect(kanbanCanon.cardPositions.todo.length).toBe(1);
        expect(kanbanCanon.cardPositions.todo[0]).toBe(newKanbanCanonCardId);
      });
  });

  it("creates a kanbanCanonCard successfully at desired index and updates kanbanCanon's cardPositions array when admin is logged in", async () => {
    // adds card to db, sneakily set the cardPositions by re-adding kanbanCanon ;)
    await testManager.deleteAllKanbanCanons();
    const KANBAN_CANON_CARDS = [KANBAN_CANON_CARD_2, KANBAN_CANON_CARD_3];
    const todoIdArr = KANBAN_CANON_CARDS.map((kcc) => kcc.id);
    await testManager.addKanbanCanons([
      { ...KANBAN_CANON_1_RAW, cardPositions: { todo: todoIdArr, wip: [], done: [] } },
    ]);
    await testManager.addKanbanCanonCards(KANBAN_CANON_CARDS);

    let newKanbanCanonCardId: string;
    await testManager
      .getGraphQLResponse({
        query: CREATE_KANBAN_CANON_CARD_MUTATION,
        variables: { input: { ...CREATE_KANBAN_CANON_CARD_1_INPUT, index: 1 } },
        cookies: adminCookies,
      })
      .then(testManager.parseData)
      .then(({ createKanbanCanonCard }) => {
        newKanbanCanonCardId = createKanbanCanonCard.id;
        expect(createKanbanCanonCard).toMatchObject(CREATE_KANBAN_CANON_CARD_1_INPUT);
      });
    // updates kanbanCanon's id array
    await testManager
      .getGraphQLResponse({
        query: GET_KANBAN_CANON_QUERY,
        variables: { id: CREATE_KANBAN_CANON_CARD_1_INPUT.kanbanCanonId },
        cookies: adminCookies,
      })
      .then(testManager.parseData)
      .then(({ kanbanCanon }) => {
        expect(kanbanCanon.cardPositions.todo.length).toBe(3);
        expect(kanbanCanon.cardPositions.todo[1]).toBe(newKanbanCanonCardId);
      });
  });
  it("creates a kanbanCanonCard successfully and updates kanbanCanon's cardPositions array at default position when no position data provided, when admin is logged in", async () => {
    // adds card to db, sneakily set the cardPositions by re-adding kanbanCanon ;)
    await testManager.deleteAllKanbanCanons();
    const KANBAN_CANON_CARDS = [KANBAN_CANON_CARD_2, KANBAN_CANON_CARD_3];
    const todoIdArr = KANBAN_CANON_CARDS.map((kcc) => kcc.id);
    await testManager.addKanbanCanons([
      { ...KANBAN_CANON_1_RAW, cardPositions: { todo: todoIdArr, wip: [], done: [] } },
    ]);
    await testManager.addKanbanCanonCards(KANBAN_CANON_CARDS);

    let newKanbanCanonCardId: string;
    await testManager
      .getGraphQLResponse({
        query: CREATE_KANBAN_CANON_CARD_MUTATION,
        variables: { input: CREATE_KANBAN_CANON_CARD_1_INPUT }, // provide no index or status input
        cookies: adminCookies,
      })
      .then(testManager.parseData)
      .then(({ createKanbanCanonCard }) => {
        newKanbanCanonCardId = createKanbanCanonCard.id;
        expect(createKanbanCanonCard).toMatchObject(CREATE_KANBAN_CANON_CARD_1_INPUT);
      });
    // updates kanbanCanon's id array
    await testManager
      .getGraphQLResponse({
        query: GET_KANBAN_CANON_QUERY,
        variables: { id: CREATE_KANBAN_CANON_CARD_1_INPUT.kanbanCanonId },
        cookies: adminCookies,
      })
      .then(testManager.parseData)
      .then(({ kanbanCanon }) => {
        expect(kanbanCanon.cardPositions.todo.length).toBe(3);
        expect(kanbanCanon.cardPositions.todo[0]).toBe(newKanbanCanonCardId);
      });
  });
  // it defaults to TODO and index 0 if no status/index provided
  it("returns an 'unauthorized' error message when creating a kanbanCanonCard without admin cookies", async () => {
    await testManager
      .getErrorMessage({
        query: CREATE_KANBAN_CANON_CARD_MUTATION,
        variables: { input: CREATE_KANBAN_CANON_CARD_1_INPUT },
        cookies: [],
      })
      .then((errorMessage) => {
        expect(errorMessage).toMatch(/[(not |un)]authorized/i);
      });
  });

  it("returns an appropriate error message when a field is missing", async () => {
    await testManager
      .getErrorMessage({
        query: CREATE_KANBAN_CANON_CARD_MUTATION,
        variables: { input: { ...CREATE_KANBAN_CANON_CARD_1_INPUT, body: undefined } },
        cookies: adminCookies,
      })
      .then((errorMessage) => {
        expect(errorMessage).toMatch(/body/i);
      });
  });

  it("returns an appropriate error message when a field is in wrong type", async () => {
    await testManager
      .getErrorMessage({
        query: CREATE_KANBAN_CANON_CARD_MUTATION,
        variables: { input: { ...CREATE_KANBAN_CANON_CARD_1_INPUT, title: 100 } },
        cookies: adminCookies,
      })
      .then((errorMessage) => {
        expect(errorMessage).toMatch(/title/i);
      });
  });
  it("gives an error message from validator when an input is invalid", async () => {
    await testManager
      .getErrorMessage({
        query: CREATE_KANBAN_CANON_CARD_MUTATION,
        variables: { input: { ...CREATE_KANBAN_CANON_CARD_1_INPUT, title: "a" } },
        cookies: adminCookies,
      })
      .then((errorMessage) => {
        expect(errorMessage).toMatch(/short/i);
      });
  });
});

describe("Editing kanbanCanonCards", () => {
  beforeEach(async () => {
    await testManager.deleteAllKanbanCanonCards();
    await testManager.addKanbanCanonCards([KANBAN_CANON_CARD_1]);
  });

  it("edits a kanbanCanonCard successfully when admin is logged in", async () => {
    await testManager
      .getGraphQLResponse({
        query: EDIT_KANBAN_CANON_CARD_MUTATION,
        variables: { id: KANBAN_CANON_CARD_1.id, input: EDIT_KANBAN_CANON_CARD_INPUT },
        cookies: adminCookies,
      })
      .then(testManager.parseData)
      .then(({ editKanbanCanonCard }) => {
        expect(editKanbanCanonCard.title).not.toBe(KANBAN_CANON_CARD_1.title);
        expect(editKanbanCanonCard.title).toBe(EDIT_KANBAN_CANON_CARD_INPUT.title);
      });
  });
  it("updates the updatedAt timestamp after editing a kanbanCanonCard", async () => {
    // Check that createdAt is initially equal to updatedAt
    await testManager
      .getGraphQLData({ query: GET_KANBAN_CANON_CARD_QUERY, variables: { id: KANBAN_CANON_CARD_1.id } })
      .then(({ kanbanCanonCard }) => expect(kanbanCanonCard.createdAt).toBe(kanbanCanonCard.updatedAt));

    await testManager
      .getGraphQLData({
        query: EDIT_KANBAN_CANON_CARD_MUTATION,
        variables: { id: KANBAN_CANON_CARD_1.id, input: EDIT_KANBAN_CANON_CARD_INPUT },
        cookies: adminCookies,
      })
      .then(({ editKanbanCanonCard }) => {
        expect(editKanbanCanonCard.createdAt < editKanbanCanonCard.updatedAt).toBe(true);
      });
  });

  it("returns an 'unauthorized' error message when editing a kanbanCanonCard without admin cookies", async () => {
    await testManager
      .getErrorMessage({
        query: EDIT_KANBAN_CANON_CARD_MUTATION,
        variables: { id: KANBAN_CANON_CARD_1.id, input: EDIT_KANBAN_CANON_CARD_INPUT },
        cookies: [],
      })
      .then((errorMessage) => {
        expect(errorMessage).toMatch(/[(not |un)authorized]/i);
      });
  });

  it("gives an error message from validator when the id of the meet does not exist", async () => {
    await testManager
      .getErrorMessage({
        query: EDIT_KANBAN_CANON_CARD_MUTATION,
        variables: { id: "7fab763c-0bac-4ccc-b2b7-b8587104c10c", input: EDIT_KANBAN_CANON_CARD_INPUT },
        cookies: adminCookies,
      })
      .then((errorMessage) => {
        expect(errorMessage).toMatch(/not exist/i);
      });
  });

  it("gives an error message from validator when an input is invalid", async () => {
    await testManager
      .getErrorMessage({
        query: EDIT_KANBAN_CANON_CARD_MUTATION,
        variables: { id: KANBAN_CANON_CARD_1.id, input: { body: "a" } },
        cookies: adminCookies,
      })
      .then((errorMessage) => {
        expect(errorMessage).toMatch(/short/i);
      });
  });

  it("gives an error message when no edit fields are specified in the mutation", async () => {
    await testManager
      .getErrorMessage({
        query: EDIT_KANBAN_CANON_CARD_MUTATION,
        variables: { id: KANBAN_CANON_CARD_1.id, input: {} },
        cookies: adminCookies,
      })
      .then((errorMessage) => {
        expect(errorMessage).toMatch(/field/i);
      });
  });

  it("gives an error message when trying to edit a non-existent field", async () => {
    await testManager
      .getErrorMessage({
        query: EDIT_KANBAN_CANON_CARD_MUTATION,
        variables: { id: KANBAN_CANON_CARD_1.id, input: { nonexistent: "hello" } },
        cookies: adminCookies,
      })
      .then((errorMessage) => {
        expect(errorMessage).toMatch(/invalid/i);
      });
  });

  it("gives an error message when trying to edit a field that exists in db but is not defined in schema", async () => {
    await testManager
      .getErrorMessage({
        query: EDIT_KANBAN_CANON_CARD_MUTATION,
        variables: { id: KANBAN_CANON_CARD_1.id, input: { deleted: true } },
        cookies: adminCookies,
      })
      .then((errorMessage) => {
        expect(errorMessage).toMatch(/invalid/i);
      });
  });
});

describe("Deleting kanbanCanonCards", () => {
  beforeEach(async () => {
    await testManager.deleteAllKanbanCanonCards();
    await testManager.addKanbanCanonCards([KANBAN_CANON_CARD_1]);
  });

  it("deletes a kanbanCanonCard successfully when admin is logged in", async () => {
    await testManager
      .getGraphQLData({ query: GET_KANBAN_CANON_CARDS_QUERY, variables: { kanbanCanonId: KANBAN_CANON_1_RAW.id } })
      .then(({ kanbanCanonCards }) => expect(kanbanCanonCards).toHaveLength(1));

    await testManager
      .getGraphQLData({
        query: DELETE_KANBAN_CANON_CARD_MUTATION,
        variables: { id: KANBAN_CANON_CARD_1.id },
        cookies: adminCookies,
      })
      .then(({ deleteKanbanCanonCard }) => {
        expect(deleteKanbanCanonCard).toBe(true);
      });

    await testManager
      .getGraphQLData({ query: GET_KANBAN_CANON_CARDS_QUERY, variables: { kanbanCanonId: KANBAN_CANON_1_RAW.id } })
      .then(({ kanbanCanonCards }) => expect(kanbanCanonCards).toHaveLength(0));
  });

  it("deletes a kanbanCanonCard's id from kanbanCanon.cardPositions array when card deleted", async () => {
    await testManager.deleteAllKanbanCanons();
    const KANBAN_CANON_CARDS = [KANBAN_CANON_CARD_1, KANBAN_CANON_CARD_2, KANBAN_CANON_CARD_3];
    const todoIdArr = KANBAN_CANON_CARDS.map((kcc) => kcc.id);
    await testManager.addKanbanCanons([
      { ...KANBAN_CANON_1_RAW, cardPositions: { todo: todoIdArr, wip: [], done: [] } },
    ]);
    await testManager.addKanbanCanonCards(KANBAN_CANON_CARDS);
    await testManager
      .getGraphQLData({ query: GET_KANBAN_CANON_CARDS_QUERY, variables: { kanbanCanonId: KANBAN_CANON_1_RAW.id } })
      .then(({ kanbanCanonCards }) => expect(kanbanCanonCards).toHaveLength(3));

    // kanbanCanon.cardPositions.todo includes card that will be deleted soon
    await testManager
      .getGraphQLData({ query: GET_KANBAN_CANON_QUERY, variables: { id: KANBAN_CANON_1_RAW.id } })
      .then(({ kanbanCanon }) => {
        expect(kanbanCanon.cardPositions.todo).toHaveLength(3);
        expect(kanbanCanon.cardPositions.todo.includes(KANBAN_CANON_CARD_1.id)).toBe(true);
      });

    await testManager
      .getGraphQLData({
        query: DELETE_KANBAN_CANON_CARD_MUTATION,
        variables: { id: KANBAN_CANON_CARD_1.id },
        cookies: adminCookies,
      })
      .then(({ deleteKanbanCanonCard }) => {
        expect(deleteKanbanCanonCard).toBe(true);
      });

    await testManager
      .getGraphQLData({ query: GET_KANBAN_CANON_CARDS_QUERY, variables: { kanbanCanonId: KANBAN_CANON_1_RAW.id } })
      .then(({ kanbanCanonCards }) => expect(kanbanCanonCards).toHaveLength(2));
    await testManager
      .getGraphQLData({ query: GET_KANBAN_CANON_QUERY, variables: { id: KANBAN_CANON_1_RAW.id } })
      .then(({ kanbanCanon }) => {
        expect(kanbanCanon.cardPositions.todo).toHaveLength(2);
        expect(kanbanCanon.cardPositions.todo.includes(KANBAN_CANON_CARD_1.id)).toBe(false);
      });
  });

  it("returns an 'unauthorized' error message when deleting a kanbanCanonCard without admin cookies", async () => {
    await testManager
      .getErrorMessage({
        query: DELETE_KANBAN_CANON_CARD_MUTATION,
        variables: { id: KANBAN_CANON_CARD_1.id },
        cookies: [],
      })
      .then((errorMessage) => {
        expect(errorMessage).toMatch(/[(not |un)authorized]/i);
      });
  });

  it("gives an error message from validator when the id of the kanbanCanonCard does not exist", async () => {
    await testManager
      .getErrorMessage({
        query: DELETE_KANBAN_CANON_CARD_MUTATION,
        variables: { id: "7fab763c-0bac-4ccc-b2b7-b8587104c10c" },
        cookies: adminCookies,
      })
      .then((errorMessage) => {
        expect(errorMessage).toMatch(/not exist/i);
      });
  });
});
