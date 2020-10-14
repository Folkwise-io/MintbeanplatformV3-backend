import { KanbanSessionCard } from "../src/types/gqlGeneratedTypes";
import {
  CREATE_KANBAN_SESSION_CARD_MUTATION,
  DELETE_KANBAN_SESSION_CARD_MUTATION,
  EDIT_KANBAN_SESSION_CARD_INPUT,
  EDIT_KANBAN_SESSION_CARD_MUTATION,
  GET_KANBAN_SESSION_CARDS_ON_KANBAN_SESSION_QUERY,
  GET_KANBAN_SESSION_CARD_QUERY,
  TEST_MEET_KANBAN_SESSION_CARD_1,
  TEST_MEET_KANBAN_SESSION_CARD_2,
  TEST_ISOLATED_KANBAN_SESSION_CARD_1,
  TEST_ISOLATED_KANBAN_SESSION_CARD_2,
  TEST_MEET_KANBAN_SESSION_CARD_1_INPUT,
  TEST_ISOLATED_KANBAN_SESSION_CARD_1_INPUT,
} from "./src/kanbanSessionCardConstants";
import { TEST_KANBAN } from "./src/kanbanConstants";
import { TEST_KANBAN_SESSION_ISOLATED, TEST_KANBAN_SESSION_ON_MEET } from "./src/kanbanSessionConstants";
import { PAPERJS } from "./src/meetConstants";
import TestManager from "./src/TestManager";
import { getAdminCookies } from "./src/util";
import { BOB } from "./src/userConstants";
import { TEST_KANBAN_CARD_1, TEST_KANBAN_CARD_2 } from "./src/kanbanCardConstants";

const testManager = TestManager.build();

beforeAll(async () => {
  await testManager.addUsers([BOB]);
});

beforeEach(async () => {
  await testManager.deleteAllKanbanSessions();
  await testManager.deleteAllKanbans();
  await testManager.deleteAllMeets();

  await testManager.addKanbans([TEST_KANBAN]);
  await testManager.addKanbanCards([TEST_KANBAN_CARD_1, TEST_KANBAN_CARD_2]);
  await testManager.addMeets([PAPERJS]);
});

afterEach(async () => {
  await testManager.deleteAllKanbanSessions();
});

afterAll(async () => {
  await testManager.deleteAllKanbanSessions();
  await testManager.deleteAllMeets();
  await testManager.deleteAllKanbans();
  await testManager.deleteAllUsers();
  await testManager.destroy();
});

describe.skip("Querying kanban session cards", () => {
  it("gets a meet kanban session card by id", async () => {
    await testManager.addKanbanSessions([TEST_KANBAN_SESSION_ON_MEET]);
    await testManager
      .addKanbanSessionCards([TEST_MEET_KANBAN_SESSION_CARD_1])
      .then(() =>
        testManager
          .getGraphQLResponse({
            query: GET_KANBAN_SESSION_CARD_QUERY,
            variables: { id: TEST_MEET_KANBAN_SESSION_CARD_1.id },
          })
          .then(testManager.parseData),
      )
      .then(({ kanbanSessionCard }) => {
        expect(TEST_MEET_KANBAN_SESSION_CARD_1).toMatchObject(kanbanSessionCard);
      });
  });

  it("gets an isolated kanban session card by id", async () => {
    await testManager.addKanbanSessions([TEST_KANBAN_SESSION_ISOLATED]);
    await testManager
      .addKanbanSessionCards([TEST_ISOLATED_KANBAN_SESSION_CARD_1])
      .then(() =>
        testManager
          .getGraphQLResponse({
            query: GET_KANBAN_SESSION_CARD_QUERY,
            variables: { id: TEST_ISOLATED_KANBAN_SESSION_CARD_1.id },
          })
          .then(testManager.parseData),
      )
      .then(({ kanbanSessionCard }) => {
        expect(TEST_ISOLATED_KANBAN_SESSION_CARD_1).toMatchObject(kanbanSessionCard);
      });
  });

  // it("returns empty array if there are no kanban session cards on a kanban session", async () => {
  //   await testManager
  //     .addKanbanSessionCards([])
  //     .then(() =>
  //       testManager
  //         .getGraphQLResponse({ query: GET_KANBAN_CARDS_ON_KANBAN_QUERY, variables: { kanbanId: TEST_KANBAN.id } })
  //         .then(testManager.parseData),
  //     )
  //     .then(({ kanbanCards }) => {
  //       expect(kanbanCards).toHaveLength(0);
  //     });
  // });

  //   it("does not retrieve deleted kanban cards", async () => {
  //     await testManager
  //       .addKanbanSessionCards([{ ...TEST_KANBAN_CARD_1, deleted: true } as KanbanSessionCard])
  //       .then(() =>
  //         testManager
  //           .getGraphQLResponse({ query: GET_KANBAN_CARDS_ON_KANBAN_QUERY, variables: { kanbanId: TEST_KANBAN.id } })
  //           .then(testManager.parseData),
  //       )
  //       .then(({ kanbanCards }) => {
  //         expect(kanbanCards).toHaveLength(0);
  //       });
  //   });
  //   it("returns kanban cards on a kanban", async () => {
  //     await testManager
  //       .addKanbanSessionCards([TEST_KANBAN_CARD_1])
  //       .then(() =>
  //         testManager
  //           .getGraphQLResponse({ query: GET_KANBAN_CARDS_ON_KANBAN_QUERY, variables: { kanbanId: TEST_KANBAN.id } })
  //           .then(testManager.parseData),
  //       )
  //       .then(({ kanbanCards }) => {
  //         expect(kanbanCards).toHaveLength(1);
  //         expect(kanbanCards[0].title).toBe(TEST_KANBAN_CARD_1.title);
  //         expect(kanbanCards[0].kanbanId).toBe(TEST_KANBAN.id);
  //       });
  //   });

  //   it("returns kanban cards on a kanban in order of smallest to largest index", async () => {
  //     await testManager
  //       .addKanbanSessionCards([TEST_KANBAN_CARD_2, TEST_KANBAN_CARD_1])
  //       .then(() =>
  //         testManager
  //           .getGraphQLResponse({ query: GET_KANBAN_CARDS_ON_KANBAN_QUERY, variables: { kanbanId: TEST_KANBAN.id } })
  //           .then(testManager.parseData),
  //       )
  //       .then(({ kanbanCards }) => {
  //         expect(kanbanCards).toHaveLength(2);
  //         expect(kanbanCards[0].id).toBe(TEST_KANBAN_CARD_1.id);
  //         expect(kanbanCards[1].id).toBe(TEST_KANBAN_CARD_2.id);
  //       });
  //   });
});

// describe("Creating kanban cards", () => {
//   let adminCookies: string[];

//   beforeAll(async () => {
//     adminCookies = await getAdminCookies();
//   });

//   it("creates a kanban card successfully when admin is logged in", async () => {
//     await testManager
//       .getGraphQLResponse({
//         query: CREATE_KANBAN_CARD_MUTATION,
//         variables: { input: TEST_KANBAN_CARD_INPUT_1 },
//         cookies: adminCookies,
//       })
//       .then(testManager.parseData)
//       .then(({ createKanbanSessionCard }) => {
//         expect(createKanbanSessionCard).toMatchObject(TEST_KANBAN_CARD_INPUT_1);
//       });
//   });

//   it("returns an 'unauthorized' error message when creating a kanban card without admin cookies", async () => {
//     await testManager
//       .getErrorMessage({ query: CREATE_KANBAN_CARD_MUTATION, variables: { input: TEST_KANBAN_CARD_INPUT_1 } })
//       .then((errorMessage) => {
//         expect(errorMessage).toMatch(/[(not |un)]authorized/i);
//       });
//   });

//   it("returns an appropriate error message when a field is missing", async () => {
//     await testManager
//       .getErrorMessage({
//         query: CREATE_KANBAN_CARD_MUTATION,
//         variables: { input: { ...TEST_KANBAN_CARD_INPUT_1, body: undefined } },
//         cookies: adminCookies,
//       })
//       .then((errorMessage) => {
//         expect(errorMessage).toMatch(/body/i);
//       });
//   });

//   it("returns an appropriate error message when a field is in wrong type", async () => {
//     await testManager
//       .getErrorMessage({
//         query: CREATE_KANBAN_CARD_MUTATION,
//         variables: { input: { ...TEST_KANBAN_CARD_INPUT_1, title: 100 } },
//         cookies: adminCookies,
//       })
//       .then((errorMessage) => {
//         expect(errorMessage).toMatch(/title/i);
//       });
//   });

//   it("does not allow the creation of orphaned kanban cards without an existing kanban", async () => {
//     await testManager
//       .getErrorMessage({
//         query: CREATE_KANBAN_CARD_MUTATION,
//         variables: { input: { ...TEST_KANBAN_CARD_INPUT_1, kanbanId: "7fab763c-0bac-4ccc-b2b7-b8587104c10c" } },
//         cookies: adminCookies,
//       })
//       .then((errorMessage) => {
//         expect(errorMessage).toMatch(/kanban/i);
//       });
//   });
// });

// describe("Editing kanban cards", () => {
//   let cookies: string[];
//   let kanbanCardId: string;

//   beforeAll(async () => {
//     cookies = await getAdminCookies();
//   });

//   beforeEach(async () => {
//     await testManager
//       .getGraphQLResponse({
//         query: CREATE_KANBAN_CARD_MUTATION,
//         variables: { input: TEST_KANBAN_CARD_INPUT_1 },
//         cookies,
//       })
//       .then(testManager.parseData)
//       .then(({ createKanbanSessionCard }) => {
//         kanbanCardId = createKanbanSessionCard.id;
//       });
//   });

//   it("edits a kanban card successfully when admin is logged in", async () => {
//     await testManager
//       .getGraphQLResponse({
//         query: EDIT_KANBAN_CARD_MUTATION,
//         variables: { id: kanbanCardId, input: EDIT_KANBAN_CARD_INPUT },
//         cookies,
//       })
//       .then(testManager.parseData)
//       .then(({ editKanbanSessionCard }) => {
//         expect(editKanbanSessionCard.index).not.toBe(TEST_KANBAN_CARD_1.index);
//         expect(editKanbanSessionCard.index).toBe(EDIT_KANBAN_CARD_INPUT.index);
//       });
//   });

//   it("updates the updatedAt timestamp after editing a kanban", async () => {
//     // Check that createdAt is initially equal to updatedAt
//     await testManager
//       .getGraphQLData({ query: GET_KANBAN_CARDS_ON_KANBAN_QUERY, variables: { kanbanId: TEST_KANBAN.id } })
//       .then(({ kanbanCards }) => expect(kanbanCards[0].createdAt).toBe(kanbanCards[0].updatedAt));

//     await testManager
//       .getGraphQLData({
//         query: EDIT_KANBAN_CARD_MUTATION,
//         variables: { id: kanbanCardId, input: EDIT_KANBAN_CARD_INPUT },
//         cookies,
//       })
//       .then(({ editKanbanSessionCard }) => {
//         expect(editKanbanSessionCard.createdAt < editKanbanSessionCard.updatedAt).toBe(true);
//       });
//   });

//   it("returns an 'unauthorized' error message when editing a kanban card without admin cookies", async () => {
//     await testManager
//       .getErrorMessage({
//         query: EDIT_KANBAN_CARD_MUTATION,
//         variables: { id: kanbanCardId, input: EDIT_KANBAN_CARD_INPUT },
//         cookies: [],
//       })
//       .then((errorMessage) => {
//         expect(errorMessage).toMatch(/[(not |un)authorized]/i);
//       });
//   });

//   it("gives an error message from validator when the id of the kanban card does not exist", async () => {
//     await testManager
//       .getErrorMessage({
//         query: EDIT_KANBAN_CARD_MUTATION,
//         variables: { id: "7fab763c-0bac-4ccc-b2b7-b8587104c10c", input: EDIT_KANBAN_CARD_INPUT },
//         cookies,
//       })
//       .then((errorMessage) => {
//         expect(errorMessage).toMatch(/not exist/i);
//       });
//   });

//   it("gives an error message from validator when the kanban the card claims to belong to does not exist", async () => {
//     await testManager
//       .getErrorMessage({
//         query: EDIT_KANBAN_CARD_MUTATION,
//         variables: {
//           id: kanbanCardId,
//           input: { ...EDIT_KANBAN_CARD_INPUT, kanbanId: "7fab763c-0bac-4ccc-b2b7-b8587104c10c" },
//         },
//         cookies,
//       })
//       .then((errorMessage) => {
//         expect(errorMessage).toMatch(/not exist/i);
//       });
//   });

//   it("gives an error message when no edit fields are specified in the mutation", async () => {
//     await testManager
//       .getErrorMessage({
//         query: EDIT_KANBAN_CARD_MUTATION,
//         variables: { id: kanbanCardId, input: {} },
//         cookies,
//       })
//       .then((errorMessage) => {
//         expect(errorMessage).toMatch(/field/i);
//       });
//   });

//   it("gives an error message when trying to edit a non-existent field", async () => {
//     await testManager
//       .getErrorMessage({
//         query: EDIT_KANBAN_CARD_MUTATION,
//         variables: { id: kanbanCardId, input: { nonexistent: "hello" } },
//         cookies,
//       })
//       .then((errorMessage) => {
//         expect(errorMessage).toMatch(/invalid/i);
//       });
//   });

//   it("gives an error message when trying to edit a field that exists in db but is not defined in schema", async () => {
//     await testManager
//       .getErrorMessage({
//         query: EDIT_KANBAN_CARD_MUTATION,
//         variables: { id: kanbanCardId, input: { deleted: true } },
//         cookies,
//       })
//       .then((errorMessage) => {
//         expect(errorMessage).toMatch(/invalid/i);
//       });
//   });
// });

// describe("Deleting kanban cards", () => {
//   let cookies: string[];
//   let kanbanCardId: string;

//   beforeAll(async () => {
//     cookies = await getAdminCookies();
//   });

//   beforeEach(async () => {
//     await testManager
//       .getGraphQLResponse({
//         query: CREATE_KANBAN_CARD_MUTATION,
//         variables: { input: TEST_KANBAN_CARD_INPUT_1 },
//         cookies,
//       })
//       .then(testManager.parseData)
//       .then(({ createKanbanSessionCard }) => {
//         kanbanCardId = createKanbanSessionCard.id;
//       });
//   });

//   it("deletes a kanban card successfully when admin is logged in", async () => {
//     await testManager
//       .getGraphQLData({ query: GET_KANBAN_CARDS_ON_KANBAN_QUERY, variables: { kanbanId: TEST_KANBAN.id } })
//       .then(({ kanbanCards }) => expect(kanbanCards).toHaveLength(1));

//     await testManager
//       .getGraphQLData({
//         query: DELETE_KANBAN_CARD_MUTATION,
//         variables: { id: kanbanCardId },
//         cookies,
//       })
//       .then(({ deleteKanbanSessionCard }) => {
//         expect(deleteKanbanSessionCard).toBe(true);
//       });

//     await testManager
//       .getGraphQLData({ query: GET_KANBAN_CARDS_ON_KANBAN_QUERY, variables: { kanbanId: TEST_KANBAN.id } })
//       .then(({ kanbanCards }) => expect(kanbanCards).toHaveLength(0));
//   });

//   it("returns an 'unauthorized' error message when deleting a kanban card without admin cookies", async () => {
//     await testManager
//       .getErrorMessage({
//         query: DELETE_KANBAN_CARD_MUTATION,
//         variables: { id: kanbanCardId },
//         cookies: [],
//       })
//       .then((errorMessage) => {
//         expect(errorMessage).toMatch(/[(not |un)authorized]/i);
//       });
//   });

//   it("gives an error message from validator when the id of the kanban does not exist", async () => {
//     await testManager
//       .getErrorMessage({
//         query: DELETE_KANBAN_CARD_MUTATION,
//         variables: { id: "7fab763c-0bac-4ccc-b2b7-b8587104c10c" },
//         cookies,
//       })
//       .then((errorMessage) => {
//         expect(errorMessage).toMatch(/not exist/i);
//       });
//   });
// });
