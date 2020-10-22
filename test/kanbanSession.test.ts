import { KanbanSessionRaw } from "../src/dao/KanbanSessionDaoKnex";
import { TEST_KANBAN } from "./src/kanbanConstants";
import {
  CREATE_KANBAN_SESSION_MUTATION,
  DELETE_KANBAN_SESSION_MUTATION,
  GET_KANBAN_SESSION_QUERY,
  TEST_KANBAN_SESSION_ISOLATED_RAW,
  TEST_KANBAN_SESSION_ISOLATED_INPUT,
  TEST_KANBAN_SESSION_ON_MEET_RAW,
  TEST_KANBAN_SESSION_ON_MEET_INPUT,
  TEST_KANBAN_SESSION_ISOLATED_COMPOSED,
  TEST_KANBAN_SESSION_ON_MEET_COMPOSED,
} from "./src/kanbanSessionConstants";
import { ALGOLIA, PAPERJS } from "./src/meetConstants";
import TestManager from "./src/TestManager";
import { AMY, BOB } from "./src/userConstants";
import { getAdminCookies, getBobCookies } from "./src/util";

const testManager = TestManager.build();

let bobCookies: string[];
let adminCookies: string[];

beforeAll(async () => {
  bobCookies = await getBobCookies();
  adminCookies = await getAdminCookies();
});

afterAll(async () => {
  // Deleting kanbans deletes all kanban sessions by CASCADE
  await testManager.deleteAllKanbans();
  await testManager.deleteAllUsers();
  await testManager.deleteAllMeets();
  await testManager.destroy();
  bobCookies = [];
});

describe("Querying kanban sessions", () => {
  beforeEach(async () => {
    // Deleting kanbans deletes all kanban sessions by CASCADE
    await testManager.deleteAllKanbans();
    await testManager.deleteAllUsers();
    await testManager.deleteAllMeets();

    await testManager.addUsers([AMY, BOB]);
    await testManager.addKanbans([TEST_KANBAN]);
    await testManager.addMeets([PAPERJS]);
  });

  it("gets a meet kanban session by kanbanId, meetId and cookies", async () => {
    await testManager.addKanbanSessions([TEST_KANBAN_SESSION_ON_MEET_RAW]).then((tm) =>
      tm
        .getGraphQLResponse({
          query: GET_KANBAN_SESSION_QUERY,
          variables: {
            kanbanId: TEST_KANBAN_SESSION_ON_MEET_RAW.kanbanId,
            meetId: TEST_KANBAN_SESSION_ON_MEET_RAW.meetId,
          },
          cookies: bobCookies,
        })
        .then(testManager.parseData)
        .then(({ kanbanSession }) => {
          expect(TEST_KANBAN_SESSION_ON_MEET_COMPOSED).toMatchObject(kanbanSession);
        }),
    );
  });

  it("gets a meet kanban session by kanbanId, meetId, and userId if logged in as admin", async () => {
    await testManager.addKanbanSessions([TEST_KANBAN_SESSION_ON_MEET_RAW]).then((tm) =>
      tm
        .getGraphQLResponse({
          query: GET_KANBAN_SESSION_QUERY,
          variables: {
            kanbanId: TEST_KANBAN_SESSION_ON_MEET_RAW.kanbanId,
            meetId: TEST_KANBAN_SESSION_ON_MEET_RAW.meetId,
            userId: TEST_KANBAN_SESSION_ON_MEET_RAW.userId,
          },
          cookies: adminCookies,
        })
        .then(testManager.parseData)
        .then(({ kanbanSession }) => {
          expect(TEST_KANBAN_SESSION_ON_MEET_COMPOSED).toMatchObject(kanbanSession);
        }),
    );
  });

  it("gets an isolated kanban session by kanbanId and cookies", async () => {
    await testManager.addKanbanSessions([TEST_KANBAN_SESSION_ISOLATED_RAW]).then((tm) =>
      tm
        .getGraphQLResponse({
          query: GET_KANBAN_SESSION_QUERY,
          variables: {
            kanbanId: TEST_KANBAN_SESSION_ISOLATED_RAW.kanbanId,
          },
          cookies: bobCookies,
        })
        .then(testManager.parseData)
        .then(({ kanbanSession }) => {
          expect(TEST_KANBAN_SESSION_ISOLATED_COMPOSED).toMatchObject(kanbanSession);
        }),
    );
  });

  it("gets an isolated kanban session by kanbanId and userId if logged in as admin", async () => {
    await testManager.addKanbanSessions([TEST_KANBAN_SESSION_ISOLATED_RAW]).then((tm) =>
      tm
        .getGraphQLResponse({
          query: GET_KANBAN_SESSION_QUERY,
          variables: {
            kanbanId: TEST_KANBAN_SESSION_ISOLATED_RAW.kanbanId,
            userId: TEST_KANBAN_SESSION_ISOLATED_RAW.userId,
          },
          cookies: adminCookies,
        })
        .then(testManager.parseData)
        .then(({ kanbanSession }) => {
          expect(TEST_KANBAN_SESSION_ISOLATED_COMPOSED).toMatchObject(kanbanSession);
        }),
    );
  });

  it("gets an admin's own meet kanban session by kanbanId, meetId, and cookies when no userId provided", async () => {
    await testManager.addKanbanSessions([{ ...TEST_KANBAN_SESSION_ON_MEET_RAW, userId: AMY.id }]).then((tm) =>
      tm
        .getGraphQLResponse({
          query: GET_KANBAN_SESSION_QUERY,
          variables: {
            kanbanId: TEST_KANBAN_SESSION_ON_MEET_RAW.kanbanId,
            meetId: TEST_KANBAN_SESSION_ON_MEET_RAW.meetId,
          },
          cookies: adminCookies,
        })
        .then(testManager.parseData)
        .then(({ kanbanSession }) => {
          expect({ ...TEST_KANBAN_SESSION_ON_MEET_COMPOSED, userId: AMY.id }).toMatchObject(kanbanSession);
        }),
    );
  });

  it("returns an 'unauthorized' error message if a non-admin user tries to get another user's kanban session", async () => {
    await testManager.addKanbanSessions([{ ...TEST_KANBAN_SESSION_ON_MEET_RAW, userId: AMY.id }]).then((tm) =>
      tm
        .getErrorMessage({
          query: GET_KANBAN_SESSION_QUERY,
          variables: {
            kanbanId: TEST_KANBAN_SESSION_ON_MEET_RAW.kanbanId,
            meetId: TEST_KANBAN_SESSION_ON_MEET_RAW.meetId,
            userId: AMY.id,
          },
          cookies: bobCookies,
        })
        .then((errorMessage) => {
          expect(errorMessage).toMatch(/[(not |un)]authorized/i);
        }),
    );
  });

  it("returns null if there is no kanban session on kanban and meet for user by cookies", async () => {
    await testManager
      .getGraphQLResponse({
        query: GET_KANBAN_SESSION_QUERY,
        variables: {
          kanbanId: TEST_KANBAN_SESSION_ON_MEET_RAW.kanbanId,
          meetId: TEST_KANBAN_SESSION_ON_MEET_RAW.meetId,
        },
        cookies: bobCookies,
      })
      .then(testManager.parseData)
      .then(({ kanbanSession }) => {
        expect(kanbanSession).toBe(null);
      });
  });

  it("does not retrieve deleted a kanban session", async () => {
    await testManager
      .addKanbanSessions([{ ...TEST_KANBAN_SESSION_ON_MEET_RAW, deleted: true } as KanbanSessionRaw])
      .then(() =>
        testManager
          .getGraphQLResponse({
            query: GET_KANBAN_SESSION_QUERY,
            variables: {
              kanbanId: TEST_KANBAN_SESSION_ON_MEET_RAW.kanbanId,
              meetId: TEST_KANBAN_SESSION_ON_MEET_RAW.meetId,
              userId: TEST_KANBAN_SESSION_ON_MEET_RAW.userId,
            },
            cookies: adminCookies,
          })
          .then(testManager.parseData)
          .then(({ kanbanSession }) => {
            expect(kanbanSession).toBe(null);
          }),
      );
  });
});

describe("Creating kanban sessions", () => {
  beforeAll(async () => {
    await testManager.deleteAllKanbans();
    await testManager.deleteAllUsers();
    await testManager.deleteAllMeets();

    await testManager.addKanbans([TEST_KANBAN]);
    await testManager.addUsers([AMY, BOB]);
    await testManager.addMeets([PAPERJS]);
  });

  it("creates a meet kanban session successfully for logged in user via cookies", async () => {
    await testManager
      .getGraphQLResponse({
        query: CREATE_KANBAN_SESSION_MUTATION,
        variables: { input: TEST_KANBAN_SESSION_ON_MEET_INPUT },
        cookies: bobCookies,
      })
      .then(testManager.parseData)
      .then(({ createKanbanSession }) => {
        expect(createKanbanSession).toMatchObject(TEST_KANBAN_SESSION_ON_MEET_INPUT);
      });
  });

  it("creates an isolated kanban session successfully for logged in user via cookies", async () => {
    await testManager
      .getGraphQLResponse({
        query: CREATE_KANBAN_SESSION_MUTATION,
        variables: { input: TEST_KANBAN_SESSION_ISOLATED_INPUT },
        cookies: bobCookies,
      })
      .then(testManager.parseData)
      .then(({ createKanbanSession }) => {
        expect(createKanbanSession).toMatchObject(TEST_KANBAN_SESSION_ISOLATED_INPUT);
      });
  });

  it("does not allow more than one kanban session per user per kanban per meet", async () => {
    await testManager.getGraphQLResponse({
      query: CREATE_KANBAN_SESSION_MUTATION,
      variables: { input: TEST_KANBAN_SESSION_ON_MEET_INPUT },
      cookies: bobCookies,
    });
    await testManager
      .getErrorMessage({
        query: CREATE_KANBAN_SESSION_MUTATION,
        variables: { input: TEST_KANBAN_SESSION_ON_MEET_INPUT },
        cookies: bobCookies,
      })
      .then((errorMessage) => {
        expect(errorMessage).toMatch(/already/);
      });
  });

  it("returns an appropriate error message when a required field is missing", async () => {
    await testManager
      .getErrorMessage({
        query: CREATE_KANBAN_SESSION_MUTATION,
        variables: { input: { ...TEST_KANBAN_SESSION_ISOLATED_INPUT, kanbanId: undefined } },
        cookies: bobCookies,
      })
      .then((errorMessage) => {
        expect(errorMessage).toMatch(/kanbanId/i);
      });
  });

  it("returns an appropriate error message when a field is in wrong type", async () => {
    await testManager
      .getErrorMessage({
        query: CREATE_KANBAN_SESSION_MUTATION,
        variables: { input: { ...TEST_KANBAN_SESSION_ISOLATED_INPUT, kanbanId: 100 } },
        cookies: bobCookies,
      })
      .then((errorMessage) => {
        expect(errorMessage).toMatch(/kanbanId/i);
      });
  });
});

// describe("Editing kanban sessions", () => {
//   let kanbanSessionId: string;

//   beforeAll(async () => {
//     await testManager.deleteAllKanbans();
//     await testManager.deleteAllUsers();
//     await testManager.deleteAllMeets();

//     await testManager.addKanbans([TEST_KANBAN]);
//     await testManager.addUsers([AMY, BOB]);
//     await testManager.addMeets([PAPERJS, ALGOLIA]);
//   });

//   beforeEach(async () => {
//     await testManager.deleteAllKanbanSessions();
//     await testManager
//       .getGraphQLResponse({
//         query: CREATE_KANBAN_SESSION_MUTATION,
//         variables: { input: TEST_KANBAN_SESSION_ON_MEET_INPUT },
//         cookies: bobCookies,
//       })
//       .then(testManager.parseData)
//       .then(({ createKanbanSession }) => {
//         kanbanSessionId = createKanbanSession.id;
//       });
//   });

//   it("edits a kanban session of currently logged in user successfully", async () => {
//     await testManager
//       .getGraphQLResponse({
//         query: EDIT_KANBAN_SESSION_MUTATION,
//         variables: { id: kanbanSessionId, input: EDIT_KANBAN_SESSION_INPUT },
//         cookies: bobCookies,
//       })
//       .then(testManager.parseData)
//       .then(({ editKanbanSession }) => {
//         expect(editKanbanSession.meetId).not.toBe(TEST_KANBAN_SESSION_ON_MEET_INPUT.meetId);
//         expect(editKanbanSession.meetId).toBe(EDIT_KANBAN_SESSION_INPUT.meetId);
//       });
//   });

//   it("updates the updatedAt timestamp after editing a kanban session", async () => {
//     // Check that createdAt is initially equal to updatedAt
//     await testManager
//       .getGraphQLData({
//         query: GET_KANBAN_SESSION_QUERY,
//         variables: {
//           kanbanId: TEST_KANBAN_SESSION_ON_MEET_RAW.kanbanId,
//           meetId: TEST_KANBAN_SESSION_ON_MEET_RAW.meetId,
//         },
//         cookies: bobCookies,
//       })
//       .then(({ kanbanSession }) => expect(kanbanSession.createdAt).toBe(kanbanSession.updatedAt));

//     await testManager
//       .getGraphQLData({
//         query: EDIT_KANBAN_SESSION_MUTATION,
//         variables: { id: kanbanSessionId, input: EDIT_KANBAN_SESSION_INPUT },
//         cookies: bobCookies,
//       })
//       .then(({ editKanbanSession }) => {
//         expect(editKanbanSession.createdAt < editKanbanSession.updatedAt).toBe(true);
//       });
//   });

//   it.skip("returns an 'unauthorized' error message when editing a kanban session without cookies that match userId", async () => {
//     await testManager
//       .getErrorMessage({
//         query: EDIT_KANBAN_SESSION_MUTATION,
//         variables: { id: kanbanSessionId, input: EDIT_KANBAN_SESSION_INPUT },
//         cookies: adminCookies,
//       })
//       .then((errorMessage) => {
//         expect(errorMessage).toMatch(/[(not |un)authorized]/i);
//       });
//   });

//   it("gives an error message from validator when the id of the kanban does not exist", async () => {
//     await testManager
//       .getErrorMessage({
//         query: EDIT_KANBAN_SESSION_MUTATION,
//         variables: { id: "7fab763c-0bac-4ccc-b2b7-b8587104c10c", input: EDIT_KANBAN_SESSION_INPUT },
//         cookies: bobCookies,
//       })
//       .then((errorMessage) => {
//         expect(errorMessage).toMatch(/not exist/i);
//       });
//   });

//   it("gives an error message when no edit fields are specified in the mutation", async () => {
//     await testManager
//       .getErrorMessage({
//         query: EDIT_KANBAN_SESSION_MUTATION,
//         variables: { id: kanbanSessionId, input: {} },
//         cookies: bobCookies,
//       })
//       .then((errorMessage) => {
//         expect(errorMessage).toMatch(/field/i);
//       });
//   });

//   it("gives an error message when trying to edit a non-existent field", async () => {
//     await testManager
//       .getErrorMessage({
//         query: EDIT_KANBAN_SESSION_MUTATION,
//         variables: { id: kanbanSessionId, input: { nonexistent: "hello" } },
//         cookies: bobCookies,
//       })
//       .then((errorMessage) => {
//         expect(errorMessage).toMatch(/invalid/i);
//       });
//   });

//   it("gives an error message when trying to edit a field that exists in db but is not defined in schema", async () => {
//     await testManager
//       .getErrorMessage({
//         query: EDIT_KANBAN_SESSION_MUTATION,
//         variables: { id: kanbanSessionId, input: { deleted: true } },
//         cookies: bobCookies,
//       })
//       .then((errorMessage) => {
//         expect(errorMessage).toMatch(/invalid/i);
//       });
//   });
// });

describe("Deleting kanban sessions", () => {
  let kanbanSessionId: string;

  beforeAll(async () => {
    await testManager.deleteAllKanbans();
    await testManager.deleteAllUsers();
    await testManager.deleteAllMeets();

    await testManager.addKanbans([TEST_KANBAN]);
    await testManager.addUsers([AMY, BOB]);
    await testManager.addMeets([PAPERJS, ALGOLIA]);
  });

  beforeEach(async () => {
    await testManager.deleteAllKanbanSessions();
    await testManager
      .getGraphQLResponse({
        query: CREATE_KANBAN_SESSION_MUTATION,
        variables: { input: TEST_KANBAN_SESSION_ON_MEET_INPUT },
        cookies: bobCookies,
      })
      .then(testManager.parseData)
      .then(({ createKanbanSession }) => {
        kanbanSessionId = createKanbanSession.id;
      });
  });

  it("deletes a kanban session successfully when requested by kanban session owner", async () => {
    await testManager
      .getGraphQLData({
        query: GET_KANBAN_SESSION_QUERY,
        variables: {
          meetId: TEST_KANBAN_SESSION_ON_MEET_INPUT.meetId,
          kanbanId: TEST_KANBAN_SESSION_ON_MEET_INPUT.kanbanId,
        },
        cookies: bobCookies,
      })
      .then(({ kanbanSession }) => expect(kanbanSession).toMatchObject(TEST_KANBAN_SESSION_ON_MEET_INPUT));

    await testManager
      .getGraphQLData({
        query: DELETE_KANBAN_SESSION_MUTATION,
        variables: { id: kanbanSessionId },
        cookies: bobCookies,
      })
      .then(({ deleteKanbanSession }) => {
        expect(deleteKanbanSession).toBe(true);
      });

    await testManager
      .getGraphQLData({
        query: GET_KANBAN_SESSION_QUERY,
        variables: {
          meetId: TEST_KANBAN_SESSION_ON_MEET_INPUT.meetId,
          kanbanId: TEST_KANBAN_SESSION_ON_MEET_INPUT.kanbanId,
        },
        cookies: bobCookies,
      })
      .then(({ kanbanSession }) => expect(kanbanSession).toBe(null));
  });

  it("returns an 'unauthorized' error message when attempting to delete someone else's kanban session", async () => {
    await testManager
      .getErrorMessage({
        query: DELETE_KANBAN_SESSION_MUTATION,
        variables: { id: kanbanSessionId },
        cookies: adminCookies,
      })
      .then((errorMessage) => {
        expect(errorMessage).toMatch(/[(not |un)authorized]/i);
      });
  });

  it("gives an error message from validator when the id of the kanban does not exist", async () => {
    await testManager
      .getErrorMessage({
        query: DELETE_KANBAN_SESSION_MUTATION,
        variables: { id: "7fab763c-0bac-4ccc-b2b7-b8587104c10c" },
        cookies: bobCookies,
      })
      .then((errorMessage) => {
        expect(errorMessage).toMatch(/not exist/i);
      });
  });
});
