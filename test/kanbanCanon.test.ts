import {
  CREATE_KANBAN_CANON_MUTATION,
  GET_KANBAN_CANONS_QUERY,
  GET_KANBAN_CANON_QUERY,
  KANBAN_CANON_1,
  KANBAN_CANON_1_INPUT,
  KANBAN_CANON_2,
} from "./src/kanbanCanonConstants";
import TestManager from "./src/TestManager";
import { AMY, BOB } from "./src/userConstants";
import { getAdminCookies, getBobCookies } from "./src/util";

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
      .addKanbanCanons([KANBAN_CANON_1])
      .then(() =>
        testManager
          .getGraphQLResponse({ query: GET_KANBAN_CANON_QUERY, variables: { id: KANBAN_CANON_1.id } })
          .then(testManager.parseData),
      )
      .then(({ kanbanCanon }) => {
        expect(kanbanCanon).toMatchObject(KANBAN_CANON_1);
      });
  });
  it("gets all kanbanCanons", async () => {
    await testManager
      .addKanbanCanons([KANBAN_CANON_1, KANBAN_CANON_2])
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
  it("does not retrieve deleted kanbanCanons", async () => {
    await testManager.addKanbanCanons([{ ...KANBAN_CANON_2, deleted: true } as any]);
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
        variables: { input: KANBAN_CANON_1_INPUT },
        cookies: adminCookies,
      })
      .then(testManager.parseData)
      .then(({ createKanbanCanon }) => {
        expect(createKanbanCanon).toMatchObject(KANBAN_CANON_1_INPUT);
      });
  });
  it("throws 'not authorized' error if createKanbanSession is called while user not logged in", async () => {
    await testManager
      .getErrorMessage({
        query: CREATE_KANBAN_CANON_MUTATION,
        variables: { input: KANBAN_CANON_1_INPUT },
      })
      .then((errorMessage) => {
        expect(errorMessage).toMatch(/[(not |un)]authorized/i);
      });
  });
  it("throws 'not authorized' error if createKanbanSession is called by non-admin user", async () => {
    await testManager
      .getErrorMessage({
        query: CREATE_KANBAN_CANON_MUTATION,
        variables: { input: KANBAN_CANON_1_INPUT },
        cookies: bobCookies,
      })
      .then((errorMessage) => {
        expect(errorMessage).toMatch(/[(not |un)]authorized/i);
      });
  });
  it("returns an appropriate error message when a field is missing", async () => {
    const partialInput = { title: "A title" };
    await testManager
      .getErrorMessage({
        query: CREATE_KANBAN_CANON_MUTATION,
        variables: { input: partialInput },
        cookies: adminCookies,
      })
      .then((errorMessage) => {
        expect(errorMessage).toMatch(/description/i);
      });
  });
  it("returns an appropriate error message when a field is in wrong type", async () => {
    await testManager
      .getErrorMessage({
        query: CREATE_KANBAN_CANON_MUTATION,
        variables: { input: { ...KANBAN_CANON_1_INPUT, title: 100 } },
        cookies: adminCookies,
      })
      .then((errorMessage) => {
        expect(errorMessage).toMatch(/title/i);
      });
  });
});
