import { KANBAN_CANON_1 } from "./src/kanbanCanonConstants";
import { GET_KANBAN_BY_ID_QUERY, MEET_KANBAN_RAW_1 } from "./src/kanbanConstants";
import { PAPERJS } from "./src/meetConstants";
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

  await testManager.addKanbanCanons([KANBAN_CANON_1]);
  await testManager.addMeets([PAPERJS]);
});

afterAll(async () => {
  await testManager.deleteAllMeets();
  await testManager.deleteAllKanbanCanons();
  await testManager.deleteAllUsers();
  await testManager.destroy();
});

describe("Querying kanbans", () => {
  it.only("gets a kanbanCanon by id when logged in user matches kanban owner", async () => {
    await testManager
      .addKanbans([MEET_KANBAN_RAW_1])
      .then(() =>
        testManager
          .getGraphQLResponse({
            query: GET_KANBAN_BY_ID_QUERY,
            variables: { id: MEET_KANBAN_RAW_1.id },
            cookies: bobCookies,
          })
          .then(testManager.parseData),
      )
      .then(({ kanban }) => {
        expect(kanban).toMatchObject(MEET_KANBAN_RAW_1);
      });
  });
  // it("gets all kanbanCanons", async () => {
  //   await testManager
  //     .addKanbanCanons([KANBAN_CANON_1, KANBAN_CANON_2])
  //     .then(() => testManager.getGraphQLResponse({ query: GET_KANBAN_CANONS_QUERY }).then(testManager.parseData))
  //     .then(({ kanbanCanons }) => {
  //       expect(kanbanCanons).toHaveLength(2);
  //     });
  // });
  // it("returns an empty array if there are no kanbanCanons", async () => {
  //   await testManager
  //     .getGraphQLResponse({ query: GET_KANBAN_CANONS_QUERY })
  //     .then(testManager.parseData)
  //     .then(({ kanbanCanons }) => {
  //       expect(kanbanCanons).toHaveLength(0);
  //     });
  // });
  // it("does not retrieve deleted kanbanCanons", async () => {
  //   await testManager.addKanbanCanons([{ ...KANBAN_CANON_2, deleted: true } as any]);
  //   await testManager
  //     .getGraphQLResponse({ query: GET_KANBAN_CANONS_QUERY })
  //     .then(testManager.parseData)
  //     .then(({ kanbanCanons }) => {
  //       expect(kanbanCanons).toHaveLength(0);
  //     });
  // });
});
