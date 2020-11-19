import {
  CreateKanbanCanonInput,
  EditKanbanCanonInput,
  KanbanCanon,
  KanbanCanonCardStatusEnum,
  KanbanCardPositions,
  QueryKanbanCanonArgs,
} from "../types/gqlGeneratedTypes";

export interface KanbanCanonDaoGetOneArgs extends QueryKanbanCanonArgs {}
export interface KanbanCanonDaoAddOneInput extends CreateKanbanCanonInput {}
export interface KanbanCanonDaoEditOneInput extends EditKanbanCanonInput {}
export interface KanbanCanonDaoUpdateCardPositionsInput {
  cardId: string;
  status: KanbanCanonCardStatusEnum;
  index: number;
}
export interface KanbanCanonCardDaoDeleteCardFromPositionInput {
  kanbanCanonCardId: string;
}

export default interface KanbanCanonDao {
  getOne(args: KanbanCanonDaoGetOneArgs): Promise<KanbanCanon>;
  getMany(): Promise<KanbanCanon[]>;
  addOne(input: KanbanCanonDaoAddOneInput): Promise<{ id: string }>;
  editOne(id: string, input: KanbanCanonDaoEditOneInput): Promise<KanbanCanon>;
  updateCardPositions(id: string, input: KanbanCanonDaoUpdateCardPositionsInput): Promise<KanbanCardPositions>;
  insertNewCardPosition(id: string, input: KanbanCanonDaoUpdateCardPositionsInput): Promise<KanbanCardPositions>;
  deleteCardFromPosition(
    id: string,
    input: KanbanCanonCardDaoDeleteCardFromPositionInput,
  ): Promise<KanbanCardPositions>;
}
