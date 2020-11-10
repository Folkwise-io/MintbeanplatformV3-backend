import { KanbanCanonCardStatusEnum } from "../src/types/gqlGeneratedTypes";
import { KANBAN_CANON_CARD_1, KANBAN_CANON_CARD_2, KANBAN_CANON_CARD_3 } from "./src/kanbanCanonCardConstants";
import { KANBAN_CANON_1_RAW, KANBAN_CANON_2_RAW } from "./src/kanbanCanonConstants";
import { GET_KANBAN_CARDS_QUERY, KANBAN_SESSION_CARD_RAW_1 } from "./src/kanbanCardConstants";
import { ISOLATED_KANBAN_RAW_1, MEET_KANBAN_RAW_1 } from "./src/kanbanConstants";
import { PAPERJS } from "./src/meetConstants";
import TestManager from "./src/TestManager";
import { BOB } from "./src/userConstants";
import { getBobCookies, getDorthyCookies } from "./src/util";

const testManager = TestManager.build();
let bobCookies: string[];
let dorthyCookies: string[];

beforeAll(async () => {
  await testManager.deleteAllUsers();
  bobCookies = await getBobCookies();
  dorthyCookies = await getDorthyCookies();
  await testManager.addUsers([BOB]);
});

beforeEach(async () => {
  await testManager.deleteAllKanbanCanons(); // Deletes kanbans/kanban cards on CASCADE
  await testManager.deleteAllMeets();

  await testManager.addMeets([PAPERJS]);
  await testManager.addKanbanCanons([KANBAN_CANON_1_RAW, KANBAN_CANON_2_RAW]); // KANBAN_CANON_2_RAW has no kanbanCanonCards
  await testManager.addKanbanCanonCards([KANBAN_CANON_CARD_1, KANBAN_CANON_CARD_2, KANBAN_CANON_CARD_3]);
  await testManager.addKanbans([MEET_KANBAN_RAW_1]);
});

afterAll(async () => {
  await testManager.deleteAllMeets();
  await testManager.deleteAllKanbanCanons();
  await testManager.deleteAllUsers();
  await testManager.destroy();
});

describe("Updating kanbanCards", () => {
  it("gets all kanban cards on a kanban regardless of whether kanban card session data exists", async () => {
    await testManager
      .addKanbanSessionCards([KANBAN_SESSION_CARD_RAW_1]) // only 1 kanbanSession Card, but expect 3 kanban cards because additional kanban canon cards exist
      .then(() =>
        testManager
          .getGraphQLResponse({
            query: GET_KANBAN_CARDS_QUERY,
            variables: { kanbanId: KANBAN_SESSION_CARD_RAW_1.kanbanSessionId },
          })
          .then(testManager.parseData),
      )
      .then(({ kanbanCards }) => {
        expect(kanbanCards).toHaveLength(3);
      });
  });

  it("returns an empty array if there are no kanban cards", async () => {
    await testManager.addKanbans([ISOLATED_KANBAN_RAW_1]);
    await testManager
      .getGraphQLResponse({ query: GET_KANBAN_CARDS_QUERY, variables: { kanbanId: ISOLATED_KANBAN_RAW_1.id } })
      .then(testManager.parseData)
      .then(({ kanbanCards }) => {
        expect(kanbanCards).toHaveLength(0);
      });
  });
  it("returns an error message if kanban cards are requested on a kanban that doesn't exist", async () => {
    await testManager.addKanbans([ISOLATED_KANBAN_RAW_1]);
    await testManager
      .getErrorMessage({
        query: GET_KANBAN_CARDS_QUERY,
        variables: { kanbanId: "244e97e7-bd17-4456-804a-4a39276f2405" },
      })
      .then((errorMessage) => {
        expect(errorMessage).toMatch(/not exist/i);
      });
  });
});
