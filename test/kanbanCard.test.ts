import { KanbanCanonCardStatusEnum } from "../src/types/gqlGeneratedTypes";
import { KANBAN_CANON_CARD_1, KANBAN_CANON_CARD_2, KANBAN_CANON_CARD_3 } from "./src/kanbanCanonCardConstants";
import { KANBAN_CANON_1_RAW, KANBAN_CANON_2_RAW } from "./src/kanbanCanonConstants";
import {
  GET_KANBAN_CARDS_QUERY,
  KANBAN_SESSION_CARD_RAW_1,
  UPDATE_KANBAN_CARD_MUTATION,
} from "./src/kanbanCardConstants";
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
  it("returns an empty array if there are no kanban cards", async () => {
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

describe("Editing kanbanCards", () => {
  beforeEach(async () => {
    await testManager.deleteAllKanbanCanonCards();
    await testManager.addKanbanCanonCards([KANBAN_CANON_CARD_1]);
  });

  it("updates a kanbanCard successfully when no kanban session card exists in database", async () => {
    const UPDATED_STATUS = KanbanCanonCardStatusEnum.Done;
    await testManager
      .getGraphQLResponse({
        query: UPDATE_KANBAN_CARD_MUTATION,
        variables: {
          input: { id: KANBAN_CANON_CARD_1.id, kanbanId: MEET_KANBAN_RAW_1.id, status: UPDATED_STATUS },
        },
        cookies: bobCookies,
      })
      .then(testManager.parseData)
      .then(({ updateKanbanCard }) => {
        expect(updateKanbanCard.status).toMatch(UPDATED_STATUS);
      });
  });
  it("updates a kanbanCard successfully when a kanbanSessionCard already exists in database", async () => {
    const UPDATED_STATUS = KanbanCanonCardStatusEnum.Done;
    await testManager.addKanbanSessionCards([KANBAN_SESSION_CARD_RAW_1]);
    await testManager
      .getGraphQLResponse({
        query: UPDATE_KANBAN_CARD_MUTATION,
        variables: {
          input: { id: KANBAN_CANON_CARD_1.id, kanbanId: MEET_KANBAN_RAW_1.id, status: UPDATED_STATUS },
        },
        cookies: bobCookies,
      })
      .then(testManager.parseData)
      .then(({ updateKanbanCard }) => {
        expect(updateKanbanCard.status).toMatch(UPDATED_STATUS);
      });
  });

  it("returns an 'unauthorized' error message when a user that does not own the kanbanCard attempts to update it", async () => {
    await testManager
      .getErrorMessage({
        query: UPDATE_KANBAN_CARD_MUTATION,
        variables: {
          input: { id: KANBAN_CANON_CARD_1.id, kanbanId: MEET_KANBAN_RAW_1.id, status: KanbanCanonCardStatusEnum.Done },
        },
        cookies: dorthyCookies,
      })
      .then((errorMessage) => {
        expect(errorMessage).toMatch(/[(not |un)authorized]/i);
      });
  });

  it("gives an error message from validator when the kanbanCard does not exist", async () => {
    await testManager
      .getErrorMessage({
        query: UPDATE_KANBAN_CARD_MUTATION,
        variables: {
          input: {
            id: "7fab763c-0bac-4ccc-b2b7-b8587104c10c",
            kanbanId: MEET_KANBAN_RAW_1.id,
            status: KanbanCanonCardStatusEnum.Done,
          },
        },
        cookies: bobCookies,
      })
      .then((errorMessage) => {
        expect(errorMessage).toMatch(/not exist/i);
      });
  });

  it("gives an error message from validator when the kanban does not exist", async () => {
    await testManager
      .getErrorMessage({
        query: UPDATE_KANBAN_CARD_MUTATION,
        variables: {
          input: {
            id: KANBAN_CANON_CARD_1.id,
            kanbanId: "7fab763c-0bac-4ccc-b2b7-b8587104c10c",
            status: KanbanCanonCardStatusEnum.Done,
          },
        },
        cookies: bobCookies,
      })
      .then((errorMessage) => {
        expect(errorMessage).toMatch(/not exist/i);
      });
  });

  it("gives an error message when no status update is specified in the mutation", async () => {
    await testManager
      .getErrorMessage({
        query: UPDATE_KANBAN_CARD_MUTATION,
        variables: {
          input: {
            id: KANBAN_CANON_CARD_1.id,
            kanbanId: MEET_KANBAN_RAW_1.id,
          },
        },
        cookies: bobCookies,
      })
      .then((errorMessage) => {
        expect(errorMessage).toMatch(/field/i);
      });
  });

  it("gives an error message when trying to update a non-existent field", async () => {
    await testManager
      .getErrorMessage({
        query: UPDATE_KANBAN_CARD_MUTATION,
        variables: {
          input: {
            id: KANBAN_CANON_CARD_1.id,
            kanbanId: MEET_KANBAN_RAW_1.id,
            status: KanbanCanonCardStatusEnum.Done,
            nonexistent: "hello",
          },
        },
        cookies: bobCookies,
      })
      .then((errorMessage) => {
        expect(errorMessage).toMatch(/invalid/i);
      });
  });

  it("gives an error message when trying to edit a field that exists in db but is not defined in schema", async () => {
    await testManager
      .getErrorMessage({
        query: UPDATE_KANBAN_CARD_MUTATION,
        variables: {
          input: {
            id: KANBAN_CANON_CARD_1.id,
            kanbanId: MEET_KANBAN_RAW_1.id,
            status: KanbanCanonCardStatusEnum.Done,
            deleted: true,
          },
        },
        cookies: bobCookies,
      })
      .then((errorMessage) => {
        expect(errorMessage).toMatch(/invalid/i);
      });
  });
});
