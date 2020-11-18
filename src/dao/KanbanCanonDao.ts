import {
  KanbanCanonServiceAddOneInput,
  KanbanCanonServiceEditOneInput,
  KanbanCanonServiceGetOneArgs,
  KanbanCanonServiceUpdateCardPositionsInput,
} from "../service/KanbanCanonService";
import { KanbanCanon, KanbanCardPositions } from "../types/gqlGeneratedTypes";

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
}
