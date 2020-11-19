// A "Kanban" is pieced together by kanbanCanon and kanbanSession data from the DB to build a personalized view of a kanban

import {
  CreateKanbanInput,
  Kanban,
  KanbanCardPositions,
  QueryKanbanArgs,
  QueryKanbansArgs,
} from "../types/gqlGeneratedTypes";
import { KanbanCanonDaoUpdateCardPositionsInput } from "./KanbanCanonDao";

export interface KanbanDaoGetOneArgs extends QueryKanbanArgs {}
export interface KanbanDaoGetManyArgs extends QueryKanbansArgs {}
export interface KanbanDaoAddOneInput extends CreateKanbanInput {}

export default interface KanbanDao {
  getOne(args: KanbanDaoGetOneArgs): Promise<Kanban | undefined>;
  getMany(args: KanbanDaoGetManyArgs): Promise<Kanban[]>;
  addOne(args: KanbanDaoAddOneInput): Promise<void>;
  // shares arg and output types with kanbanCanonDao same operation
  updateCardPositions(id: string, input: KanbanCanonDaoUpdateCardPositionsInput): Promise<KanbanCardPositions>;
  deleteOne(id: string): Promise<boolean>;
}
