import {
  GET_KANBAN_CANONS_QUERY,
  GET_KANBAN_CANON_QUERY,
  KANBAN_CANON_ISOLATED,
  KANBAN_CANON_MEET,
} from "./src/kanbanCanonConstants";
import TestManager from "./src/TestManager";

const testManager = TestManager.build();

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
      .addKanbanCanons([KANBAN_CANON_MEET])
      .then(() =>
        testManager
          .getGraphQLResponse({ query: GET_KANBAN_CANON_QUERY, variables: { id: KANBAN_CANON_MEET.id } })
          .then(testManager.parseData),
      )
      .then(({ kanbanCanon }) => {
        expect(kanbanCanon).toMatchObject(KANBAN_CANON_MEET);
      });
  });
  it("gets all kanbanCanons", async () => {
    await testManager
      .addKanbanCanons([KANBAN_CANON_MEET, KANBAN_CANON_ISOLATED])
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
    await testManager.addKanbanCanons([{ ...KANBAN_CANON_ISOLATED, deleted: true } as any]);
    await testManager
      .getGraphQLResponse({ query: GET_KANBAN_CANONS_QUERY })
      .then(testManager.parseData)
      .then(({ kanbanCanons }) => {
        expect(kanbanCanons).toHaveLength(0);
      });
  });
});
