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
  it("does not retrieve deleted kanbanCanons", async () => {
    await testManager.addKanbanCanons([{ ...KANBAN_CANON_2_RAW, deleted: true } as any]);
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
      .getErrorMessage({
        query: CREATE_KANBAN_CANON_MUTATION,
        variables: { input: CREATE_KANBAN_CANON_1_RAW_INPUT },
      })
      .then((errorMessage) => {
        expect(errorMessage).toMatch(/[(not |un)]authorized/i);
      });
  });
  it("throws 'not authorized' error if createKanbanSession is called by non-admin user", async () => {
    await testManager
      .getErrorMessage({
        query: CREATE_KANBAN_CANON_MUTATION,
        variables: { input: CREATE_KANBAN_CANON_1_RAW_INPUT },
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
        variables: { input: { ...CREATE_KANBAN_CANON_1_RAW_INPUT, title: 100 } },
        cookies: adminCookies,
      })
      .then((errorMessage) => {
        expect(errorMessage).toMatch(/title/i);
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
      .getErrorMessage({
        query: EDIT_KANBAN_CANON_MUTATION,
        variables: { id: KANBAN_CANON_1_RAW.id, input: EDIT_KANBAN_CANON_INPUT },
        cookies: [],
      })
      .then((errorMessage) => {
        expect(errorMessage).toMatch(/[(not |un)authorized]/i);
      });
  });

  it("gives an error message from validator when the id of the meet does not exist", async () => {
    await testManager
      .getErrorMessage({
        query: EDIT_KANBAN_CANON_MUTATION,
        variables: { id: "7fab763c-0bac-4ccc-b2b7-b8587104c10c", input: EDIT_KANBAN_CANON_INPUT },
        cookies: adminCookies,
      })
      .then((errorMessage) => {
        expect(errorMessage).toMatch(/not exist/i);
      });
  });

  it("gives an error message when no edit fields are specified in the mutation", async () => {
    await testManager
      .getErrorMessage({
        query: EDIT_KANBAN_CANON_MUTATION,
        variables: { id: KANBAN_CANON_1_RAW.id, input: {} },
        cookies: adminCookies,
      })
      .then((errorMessage) => {
        expect(errorMessage).toMatch(/field/i);
      });
  });

  it("gives an error message when trying to edit a non-existent field", async () => {
    await testManager
      .getErrorMessage({
        query: EDIT_KANBAN_CANON_MUTATION,
        variables: { id: KANBAN_CANON_1_RAW.id, input: { nonexistent: "hello" } },
        cookies: adminCookies,
      })
      .then((errorMessage) => {
        expect(errorMessage).toMatch(/invalid/i);
      });
  });

  it("gives an error message when trying to edit a field that exists in db but is not defined in schema", async () => {
    await testManager
      .getErrorMessage({
        query: EDIT_KANBAN_CANON_MUTATION,
        variables: { id: KANBAN_CANON_1_RAW.id, input: { deleted: true } },
        cookies: adminCookies,
      })
      .then((errorMessage) => {
        expect(errorMessage).toMatch(/invalid/i);
      });
  });
});

describe("Deleting kanbanCanons", () => {
  beforeEach(async () => {
    await testManager.addKanbanCanons([KANBAN_CANON_2_RAW]);
  });

  it("deletes a kanbanCanon successfully when admin is logged in", async () => {
    await testManager
      .getGraphQLData({ query: GET_KANBAN_CANONS_QUERY })
      .then(({ kanbanCanons }) => expect(kanbanCanons).toHaveLength(1));

    await testManager
      .getGraphQLData({
        query: DELETE_KANBAN_CANON_MUTATION,
        variables: { id: KANBAN_CANON_2_RAW.id },
        cookies: adminCookies,
      })
      .then(({ deleteKanbanCanon }) => {
        expect(deleteKanbanCanon).toBe(true);
      });

    await testManager
      .getGraphQLData({ query: GET_KANBAN_CANONS_QUERY })
      .then(({ kanbanCanons }) => expect(kanbanCanons).toHaveLength(0));
  });

  it("returns an 'unauthorized' error message when deleting a kanbanCanon without admin cookies", async () => {
    await testManager
      .getErrorMessage({
        query: DELETE_KANBAN_CANON_MUTATION,
        variables: { id: KANBAN_CANON_2_RAW.id },
        cookies: [],
      })
      .then((errorMessage) => {
        expect(errorMessage).toMatch(/[(not |un)authorized]/i);
      });
  });

  it("gives an error message from validator when the id of the meet does not exist", async () => {
    await testManager
      .getErrorMessage({
        query: DELETE_KANBAN_CANON_MUTATION,
        variables: { id: "7fab763c-0bac-4ccc-b2b7-b8587104c10c" },
        cookies: adminCookies,
      })
      .then((errorMessage) => {
        expect(errorMessage).toMatch(/not exist/i);
      });
  });
});

// describe("Updating card positions", () => {
//   it("gives an error message from validator when the id of the meet does not exist", async () => {
//     await testManager
//       .getErrorMessage({
//         query: DELETE_KANBAN_CANON_MUTATION,
//         variables: { id: "7fab763c-0bac-4ccc-b2b7-b8587104c10c" },
//         cookies: adminCookies,
//       })
//       .then((errorMessage) => {
//         expect(errorMessage).toMatch(/not exist/i);
//       });
//   });
// });
