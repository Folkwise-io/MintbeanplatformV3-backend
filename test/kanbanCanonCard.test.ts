import {
  CREATE_KANBAN_CANON_CARD_MUTATION,
  GET_KANBAN_CANON_CARDS_QUERY,
  GET_KANBAN_CANON_CARD_QUERY,
  KANBAN_CANON_CARD_1,
  KANBAN_CANON_CARD_1_INPUT,
  KANBAN_CANON_CARD_2,
} from "./src/kanbanCanonCardConstants";
import { KANBAN_CANON_1, KANBAN_CANON_2 } from "./src/kanbanCanonConstants";
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

  await testManager.addKanbanCanons([KANBAN_CANON_1]);
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
          .getGraphQLResponse({ query: GET_KANBAN_CANON_CARDS_QUERY, variables: { kanbanCanonId: KANBAN_CANON_1.id } })
          .then(testManager.parseData),
      )
      .then(({ kanbanCanonCards }) => {
        expect(kanbanCanonCards).toHaveLength(2);
      });
  });
  it("returns an empty array if there are no kanbanCanonCards", async () => {
    await testManager
      .getGraphQLResponse({ query: GET_KANBAN_CANON_CARDS_QUERY, variables: { kanbanCanonId: KANBAN_CANON_1.id } })
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
      .getErrorMessage({ query: GET_KANBAN_CANON_CARDS_QUERY, variables: { kanbanCanonId: KANBAN_CANON_2.id } })
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
      .getGraphQLResponse({ query: GET_KANBAN_CANON_CARDS_QUERY, variables: { kanbanCanonId: KANBAN_CANON_1.id } })
      .then(testManager.parseData)
      .then(({ kanbanCanonCards }) => {
        expect(kanbanCanonCards).toHaveLength(0);
      });
  });
});

describe("Creating kanbanCanonCards", () => {
  it("creates a kanbanCanonCard successfully when admin is logged in", async () => {
    await testManager
      .getGraphQLResponse({
        query: CREATE_KANBAN_CANON_CARD_MUTATION,
        variables: { input: KANBAN_CANON_CARD_1_INPUT },
        cookies: adminCookies,
      })
      .then(testManager.parseData)
      .then(({ createKanbanCanonCard }) => {
        expect(createKanbanCanonCard).toMatchObject(KANBAN_CANON_CARD_1_INPUT);
      });
  });

  it("returns an 'unauthorized' error message when creating a kanbanCanonCard without admin cookies", async () => {
    await testManager
      .getErrorMessage({
        query: CREATE_KANBAN_CANON_CARD_MUTATION,
        variables: { input: KANBAN_CANON_CARD_1_INPUT },
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
        variables: { input: { ...KANBAN_CANON_CARD_1_INPUT, body: undefined } },
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
        variables: { input: { ...KANBAN_CANON_CARD_1_INPUT, title: 100 } },
        cookies: adminCookies,
      })
      .then((errorMessage) => {
        expect(errorMessage).toMatch(/title/i);
      });
  });
});
