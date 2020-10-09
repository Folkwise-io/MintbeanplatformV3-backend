import { Kanban } from "../src/types/gqlGeneratedTypes";
import { Meet } from "../src/types/gqlGeneratedTypes";
import {
  TEST_KANBAN,
  TEST_KANBAN_INPUT,
  GET_KANBAN_QUERY,
  GET_ALL_KANBANS_QUERY,
  CREATE_KANBAN_MUTATION,
  EDIT_KANBAN_MUTATION,
  EDIT_KANBAN_INPUT,
  DELETE_KANBAN_MUTATION,
} from "./src/kanbanConstants";
import TestManager from "./src/TestManager";
import { getAdminCookies } from "./src/util";

const testManager = TestManager.build();

beforeEach(async () => {
  await testManager.deleteAllKanbans();
});

afterAll(async () => {
  await testManager.deleteAllKanbans();
  await testManager.destroy();
});

describe("Querying kanbans", () => {
  it("gets a kanban by id", async () => {
    await testManager
      .addKanbans([TEST_KANBAN])
      .then(() =>
        testManager
          .getGraphQLResponse({ query: GET_KANBAN_QUERY, variables: { id: TEST_KANBAN.id } })
          .then(testManager.parseData),
      )
      .then(({ kanban }) => {
        expect(TEST_KANBAN).toMatchObject(kanban);
      });
  });

  it("returns empty array if there are no kanbans", async () => {
    await testManager
      .addKanbans([])
      .then(() => testManager.getGraphQLResponse({ query: GET_ALL_KANBANS_QUERY }).then(testManager.parseData))
      .then(({ kanbans }) => {
        expect(kanbans).toHaveLength(0);
      });
  });

  it("does not retrieve deleted kanbans", async () => {
    await testManager
      .addKanbans([{ ...TEST_KANBAN, deleted: true } as Kanban])
      .then(() => testManager.getGraphQLResponse({ query: GET_ALL_KANBANS_QUERY }).then(testManager.parseData))
      .then(({ kanbans }) => {
        expect(kanbans).toHaveLength(0);
      });
  });
});

describe("Creating kanbans", () => {
  let adminCookies: string[];

  beforeAll(async () => {
    adminCookies = await getAdminCookies();
  });

  it("creates a kanban successfully when admin is logged in", async () => {
    await testManager
      .getGraphQLResponse({
        query: CREATE_KANBAN_MUTATION,
        variables: { input: TEST_KANBAN_INPUT },
        cookies: adminCookies,
      })
      .then(testManager.parseData)
      .then(({ createKanban }) => {
        expect(createKanban).toMatchObject(TEST_KANBAN_INPUT);
      });
  });

  it("returns an 'unauthorized' error message when creating a kanban without admin cookies", async () => {
    await testManager
      .getErrorMessage({ query: CREATE_KANBAN_MUTATION, variables: { input: TEST_KANBAN_INPUT } })
      .then((errorMessage) => {
        expect(errorMessage).toMatch(/[(not |un)]authorized/i);
      });
  });

  it("returns an appropriate error message when a field is missing", async () => {
    await testManager
      .getErrorMessage({
        query: CREATE_KANBAN_MUTATION,
        variables: { input: { ...TEST_KANBAN_INPUT, description: undefined } },
        cookies: adminCookies,
      })
      .then((errorMessage) => {
        expect(errorMessage).toMatch(/description/i);
      });
  });

  it("returns an appropriate error message when a field is in wrong type", async () => {
    await testManager
      .getErrorMessage({
        query: CREATE_KANBAN_MUTATION,
        variables: { input: { ...TEST_KANBAN_INPUT, title: 100 } },
        cookies: adminCookies,
      })
      .then((errorMessage) => {
        expect(errorMessage).toMatch(/title/i);
      });
  });
});

describe("Editing kanbans", () => {
  let cookies: string[];
  let kanbanId: string;

  beforeAll(async () => {
    cookies = await getAdminCookies();
  });

  beforeEach(async () => {
    await testManager
      .getGraphQLResponse({
        query: CREATE_KANBAN_MUTATION,
        variables: { input: TEST_KANBAN_INPUT },
        cookies,
      })
      .then(testManager.parseData)
      .then(({ createKanban }) => {
        kanbanId = createKanban.id;
      });
  });

  it("edits a kanban successfully when admin is logged in", async () => {
    await testManager
      .getGraphQLResponse({
        query: EDIT_KANBAN_MUTATION,
        variables: { id: kanbanId, input: EDIT_KANBAN_INPUT },
        cookies,
      })
      .then(testManager.parseData)
      .then(({ editKanban }) => {
        expect(editKanban.title).not.toBe(TEST_KANBAN.title);
        expect(editKanban.title).toBe(EDIT_KANBAN_INPUT.title);
      });
  });

  it("updates the updatedAt timestamp after editing a kanban", async () => {
    // Check that createdAt is initially equal to updatedAt
    await testManager
      .getGraphQLData({ query: GET_ALL_KANBANS_QUERY })
      .then(({ kanbans }) => expect(kanbans[0].createdAt).toBe(kanbans[0].updatedAt));

    await testManager
      .getGraphQLData({
        query: EDIT_KANBAN_MUTATION,
        variables: { id: kanbanId, input: EDIT_KANBAN_INPUT },
        cookies,
      })
      .then(({ editKanban }) => {
        expect(editKanban.createdAt < editKanban.updatedAt).toBe(true);
      });
  });

  it("returns an 'unauthorized' error message when editing a kanban without admin cookies", async () => {
    await testManager
      .getErrorMessage({
        query: EDIT_KANBAN_MUTATION,
        variables: { id: kanbanId, input: EDIT_KANBAN_INPUT },
        cookies: [],
      })
      .then((errorMessage) => {
        expect(errorMessage).toMatch(/[(not |un)authorized]/i);
      });
  });

  it("gives an error message from validator when the id of the kanban does not exist", async () => {
    await testManager
      .getErrorMessage({
        query: EDIT_KANBAN_MUTATION,
        variables: { id: "7fab763c-0bac-4ccc-b2b7-b8587104c10c", input: EDIT_KANBAN_INPUT },
        cookies,
      })
      .then((errorMessage) => {
        expect(errorMessage).toMatch(/not exist/i);
      });
  });

  it("gives an error message when no edit fields are specified in the mutation", async () => {
    await testManager
      .getErrorMessage({
        query: EDIT_KANBAN_MUTATION,
        variables: { id: kanbanId, input: {} },
        cookies,
      })
      .then((errorMessage) => {
        expect(errorMessage).toMatch(/field/i);
      });
  });

  it("gives an error message when trying to edit a non-existent field", async () => {
    await testManager
      .getErrorMessage({
        query: EDIT_KANBAN_MUTATION,
        variables: { id: kanbanId, input: { nonexistent: "hello" } },
        cookies,
      })
      .then((errorMessage) => {
        expect(errorMessage).toMatch(/invalid/i);
      });
  });

  it("gives an error message when trying to edit a field that exists in db but is not defined in schema", async () => {
    await testManager
      .getErrorMessage({
        query: EDIT_KANBAN_MUTATION,
        variables: { id: kanbanId, input: { deleted: true } },
        cookies,
      })
      .then((errorMessage) => {
        expect(errorMessage).toMatch(/invalid/i);
      });
  });
});

describe("Deleting kanbans", () => {
  let cookies: string[];
  let kanbanId: string;

  beforeAll(async () => {
    cookies = await getAdminCookies();
  });

  beforeEach(async () => {
    await testManager
      .getGraphQLResponse({
        query: CREATE_KANBAN_MUTATION,
        variables: { input: TEST_KANBAN_INPUT },
        cookies,
      })
      .then(testManager.parseData)
      .then(({ createKanban }) => {
        kanbanId = createKanban.id;
      });
  });

  it("deletes a kanban successfully when admin is logged in", async () => {
    await testManager
      .getGraphQLData({ query: GET_ALL_KANBANS_QUERY })
      .then(({ kanbans }) => expect(kanbans).toHaveLength(1));

    await testManager
      .getGraphQLData({
        query: DELETE_KANBAN_MUTATION,
        variables: { id: kanbanId },
        cookies,
      })
      .then(({ deleteKanban }) => {
        expect(deleteKanban).toBe(true);
      });

    await testManager
      .getGraphQLData({ query: GET_ALL_KANBANS_QUERY })
      .then(({ kanbans }) => expect(kanbans).toHaveLength(0));
  });

  it("returns an 'unauthorized' error message when deleting a kanban without admin cookies", async () => {
    await testManager
      .getErrorMessage({
        query: DELETE_KANBAN_MUTATION,
        variables: { id: kanbanId },
        cookies: [],
      })
      .then((errorMessage) => {
        expect(errorMessage).toMatch(/[(not |un)authorized]/i);
      });
  });

  it("gives an error message from validator when the id of the kanban does not exist", async () => {
    await testManager
      .getErrorMessage({
        query: DELETE_KANBAN_MUTATION,
        variables: { id: "7fab763c-0bac-4ccc-b2b7-b8587104c10c" },
        cookies,
      })
      .then((errorMessage) => {
        expect(errorMessage).toMatch(/not exist/i);
      });
  });
});
