import {
  deleteCardFromPosition,
  insertNewCardPosition,
  resolve,
  updateCardPositions,
} from "../src/dao/util/cardPositionUtils";
import { KanbanCanonCardStatusEnum } from "../src/types/gqlGeneratedTypes";
// C - canon
// S = session

// R = resolved
describe("resolve()", () => {
  describe("Sunny scenarios", () => {
    it("it resolves to the C position if S position not defined", () => {
      const C = {
        todo: ["a"],
        wip: [],
        done: [],
      };
      const S = {
        todo: [],
        wip: [],
        done: [],
      };
      const R = {
        todo: ["a"],
        wip: [],
        done: [],
      };
      expect(resolve(C, S)).toMatchObject(R);
    });
    it("it resolves such that S position supercedes C position", () => {
      const C = {
        todo: ["a"],
        wip: [],
        done: [],
      };
      const S = {
        todo: [],
        wip: ["a"],
        done: [],
      };
      const R = {
        todo: [],
        wip: ["a"],
        done: [],
      };
      expect(resolve(C, S)).toMatchObject(R);
    });
    it("it resolves with multiple card statuses in C", () => {
      const C = {
        todo: ["c"],
        wip: [],
        done: ["a"],
      };
      const S = {
        todo: [],
        wip: ["b"],
        done: [],
      };
      const R = {
        todo: ["c"],
        wip: ["b"],
        done: ["a"],
      };
      expect(resolve(C, S)).toMatchObject(R);
    });
    it("it resolves accurately when S is returned to C", () => {
      const C = {
        todo: ["a"],
        wip: [],
        done: [],
      };
      const S = {
        todo: ["a"],
        wip: [],
        done: [],
      };
      const R = {
        todo: ["a"],
        wip: [],
        done: [],
      };
      expect(resolve(C, S)).toMatchObject(R);
    });
    it("it resolves accurately when a card is moved from one status to another while other cards exist", () => {
      const C = {
        todo: ["a", "b"],
        wip: [],
        done: [],
      };
      const S = {
        todo: [],
        wip: ["a"],
        done: [],
      };
      const R = {
        todo: ["b"],
        wip: ["a"],
        done: [],
      };
      expect(resolve(C, S)).toMatchObject(R);
    });
    it("it makes S index supercede C", () => {
      const C = {
        todo: ["a", "b"],
        wip: [],
        done: [],
      };
      const S = {
        todo: ["b", "a"],
        wip: [],
        done: [],
      };
      const R = {
        todo: ["b", "a"],
        wip: [],
        done: [],
      };
      expect(resolve(C, S)).toMatchObject(R);
    });
  });

  describe("Bad data scenarios", () => {
    it("it resolves accurately when no S cards present", () => {
      const C = {
        todo: ["a"],
        wip: [],
        done: [],
      };
      const S = {
        todo: [],
        wip: [],
        done: [],
      };
      const R = {
        todo: ["a"],
        wip: [],
        done: [],
      };
      expect(resolve(C, S)).toMatchObject(R);
    });
    it("it resolves accurately when no C cards present", () => {
      const C = {
        todo: [],
        wip: [],
        done: [],
      };
      const S = {
        todo: [],
        wip: ["a"],
        done: [],
      };
      const R = {
        todo: [],
        wip: ["a"],
        done: [],
      };
      expect(resolve(C, S)).toMatchObject(R);
    });
    it("it resolves accurately when C cards partially unsynced with S", () => {
      const C = {
        todo: ["c"],
        wip: [],
        done: [],
      };
      const S = {
        todo: [],
        wip: ["b"],
        done: ["a"],
      };
      const R = {
        todo: ["c"],
        wip: ["b"],
        done: ["a"],
      };
      expect(resolve(C, S)).toMatchObject(R);
    });
  });
});

describe("updateCardPositions()", () => {
  const OLD_POSITIONS = {
    todo: ["a", "b", "c"],
    wip: [],
    done: [],
  };
  describe("Sunny scenarios", () => {
    it("updates status of a card with valid data ", () => {
      const actual = updateCardPositions({
        oldPositions: OLD_POSITIONS,
        cardId: "a",
        status: KanbanCanonCardStatusEnum.Wip,
        index: 0,
      });
      const expected = {
        todo: ["b", "c"],
        wip: ["a"],
        done: [],
      };
      expect(actual).toMatchObject(expected);
    });
    it("updates status of a card with valid data even when no new index is defined", () => {
      const actual = updateCardPositions({
        oldPositions: OLD_POSITIONS,
        cardId: "a",
        status: KanbanCanonCardStatusEnum.Wip,
      });
      const expected = {
        todo: ["b", "c"],
        wip: ["a"],
        done: [],
      };
      expect(actual).toMatchObject(expected);
    });
    it("updates index of a card", () => {
      const actual = updateCardPositions({
        oldPositions: OLD_POSITIONS,
        cardId: "a",
        status: KanbanCanonCardStatusEnum.Todo,
        index: 1,
      });
      const expected = {
        todo: ["b", "a", "c"],
        wip: [],
        done: [],
      };
      expect(actual).toMatchObject(expected);
    });
  });
  describe("Bad data scenarios", () => {
    it("deafults to the end of the array if new index is greater than the length of a given status array", () => {
      const actual = updateCardPositions({
        oldPositions: OLD_POSITIONS,
        cardId: "a",
        status: KanbanCanonCardStatusEnum.Todo,
        index: 10,
      });
      const expected = {
        todo: ["b", "c", "a"],
        wip: [],
        done: [],
      };
      expect(actual).toMatchObject(expected);
    });
    it("returns original array if negative index provided", () => {
      const actual = updateCardPositions({
        oldPositions: OLD_POSITIONS,
        cardId: "b",
        status: KanbanCanonCardStatusEnum.Todo,
        index: -1,
      });
      const expected = {
        todo: ["a", "b", "c"],
        wip: [],
        done: [],
      };
      expect(actual).toMatchObject(expected);
    });
  });
});

describe("insertNewCardPosition", () => {
  describe("Sunny scenarios", () => {
    it("appends a card to end of status id array by default if no index provided as arg", () => {
      const OLD_POSITIONS = {
        todo: ["a", "b"],
        wip: [],
        done: [],
      };
      const actual = insertNewCardPosition({
        oldPositions: OLD_POSITIONS,
        cardId: "c",
        status: KanbanCanonCardStatusEnum.Todo,
      });
      const expected = {
        todo: ["a", "b", "c"],
        wip: [],
        done: [],
      };
      expect(actual).toMatchObject(expected);
    });
    it("adds a card id at the appropriate index when provided as an arg", () => {
      const OLD_POSITIONS = {
        todo: ["a", "b", "c"],
        wip: [],
        done: [],
      };
      const actual = insertNewCardPosition({
        oldPositions: OLD_POSITIONS,
        cardId: "d",
        status: KanbanCanonCardStatusEnum.Todo,
        index: 2,
      });
      const expected = {
        todo: ["a", "b", "d", "c"],
        wip: [],
        done: [],
      };
      expect(actual).toMatchObject(expected);
    });
    it("adds a card id to a previously empty array", () => {
      const OLD_POSITIONS = {
        todo: [],
        wip: [],
        done: [],
      };
      const actual = insertNewCardPosition({
        oldPositions: OLD_POSITIONS,
        cardId: "a",
        status: KanbanCanonCardStatusEnum.Todo,
      });
      const expected = {
        todo: ["a"],
        wip: [],
        done: [],
      };
      expect(actual).toMatchObject(expected);
    });
    describe("Bad data scenarios", () => {
      it("gracefully adds id to end of array if bogus index passed", () => {
        const OLD_POSITIONS = {
          todo: ["a", "b", "c"],
          wip: [],
          done: [],
        };
        const actual = insertNewCardPosition({
          oldPositions: OLD_POSITIONS,
          cardId: "d",
          status: KanbanCanonCardStatusEnum.Todo,
          index: 100,
        });
        const expected = {
          todo: ["a", "b", "c", "d"],
          wip: [],
          done: [],
        };
        expect(actual).toMatchObject(expected);
      });
    });
  });
});

describe("deleteCardFromPosition", () => {
  describe("Sunny scenarios", () => {
    it("deletes a cardId if present", () => {
      const OLD_POSITIONS = {
        todo: ["a", "b", "c"],
        wip: [],
        done: [],
      };
      const actual = deleteCardFromPosition({
        oldPositions: OLD_POSITIONS,
        cardId: "b",
      });
      const expected = {
        todo: ["a", "c"],
        wip: [],
        done: [],
      };
      expect(actual).toMatchObject(expected);
    });
    it("deletes a cardId if present, making a status an empty array if it was the last card left", () => {
      const OLD_POSITIONS = {
        todo: ["c"],
        wip: ["a", "b"],
        done: [],
      };
      const actual = deleteCardFromPosition({
        oldPositions: OLD_POSITIONS,
        cardId: "c",
      });
      const expected = {
        todo: [],
        wip: ["a", "b"],
        done: [],
      };
      expect(actual).toMatchObject(expected);
    });
  });
  describe("Bad data scenarios", () => {
    it("gracefully fails by returning original positions if invalid cardId passed", () => {
      const OLD_POSITIONS = {
        todo: ["a", "b", "c"],
        wip: [],
        done: [],
      };
      const actual = deleteCardFromPosition({
        oldPositions: OLD_POSITIONS,
        cardId: "d",
      });
      expect(actual).toMatchObject(OLD_POSITIONS);
    });
  });
});
