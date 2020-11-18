import {
  KanbanCanonServiceAddOneInput,
  KanbanCanonServiceEditOneInput,
  KanbanCanonServiceGetOneArgs,
  KanbanCanonServiceUpdateCardPositionsInput,
} from "../service/KanbanCanonService";
import { KanbanCanon, KanbanCardPositions } from "../types/gqlGeneratedTypes";

// for test manager add many
// export interface KanbanCanonRaw {
//   id: string;
//   title: string;
//   description: string;
//   createdAt?: string;
//   updatedAt?: string;
//   cardPositions?: KanbanCardPositions;
// }

export interface KanbanCanonCardDaoDeleteCardFromPositionInput {
  kanbanCanonCardId: string;
}

export default interface KanbanCanonDao {
  getOne(args: KanbanCanonServiceGetOneArgs): Promise<KanbanCanon>;
  getMany(): Promise<KanbanCanon[]>;
  addOne(input: KanbanCanonServiceAddOneInput): Promise<{ id: string }>;
  editOne(id: string, input: KanbanCanonServiceEditOneInput): Promise<KanbanCanon>;
  updateCardPositions(id: string, input: KanbanCanonServiceUpdateCardPositionsInput): Promise<KanbanCardPositions>;
  insertNewCardPosition(id: string, input: KanbanCanonServiceUpdateCardPositionsInput): Promise<KanbanCardPositions>;
  deleteCardFromPosition(
    id: string,
    input: KanbanCanonCardDaoDeleteCardFromPositionInput,
  ): Promise<KanbanCardPositions>;

  // Testing methods for TestManager to call
  // addMany(kanbanCanons: KanbanCanonRaw[]): Promise<void>;
  // deleteAll(): Promise<void>;
}
