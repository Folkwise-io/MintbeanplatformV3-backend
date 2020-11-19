import {
  CreateKanbanCanonCardInput,
  EditKanbanCanonCardInput,
  KanbanCanonCard,
  QueryKanbanCanonCardArgs,
  QueryKanbanCanonCardsArgs,
} from "../types/gqlGeneratedTypes";

export interface KanbanCanonCardDaoGetOneArgs extends QueryKanbanCanonCardArgs {}
export interface KanbanCanonCardDaoGetManyArgs extends QueryKanbanCanonCardsArgs {}
export interface KanbanCanonCardDaoAddOneInput extends CreateKanbanCanonCardInput {}
export interface KanbanCanonCardDaoEditOneInput extends EditKanbanCanonCardInput {}

export default interface KanbanCanonCardDao {
  getOne(args: KanbanCanonCardDaoGetOneArgs): Promise<KanbanCanonCard>;
  getMany(args: KanbanCanonCardDaoGetManyArgs): Promise<KanbanCanonCard[]>;
  addOne(input: KanbanCanonCardDaoAddOneInput): Promise<KanbanCanonCard>;
  editOne(id: string, input: KanbanCanonCardDaoEditOneInput): Promise<KanbanCanonCard>;
  deleteOne(id: string): Promise<boolean>;
}
