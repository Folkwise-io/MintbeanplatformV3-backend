// A "Kanban" is pieced together by kanbanCanon and kanbanSession data from the DB to build a personalized view of a kanban

import { KanbanCanonServiceUpdateCardPositionsInput } from "../service/KanbanCanonService";
import { KanbanServiceGetOneArgs, KanbanServiceGetManyArgs, KanbanServiceAddOneInput } from "../service/KanbanService";
import { Kanban, KanbanCardPositions } from "../types/gqlGeneratedTypes";

export default interface KanbanDao {
  getOne(args: KanbanServiceGetOneArgs): Promise<Kanban | undefined>;
  getMany(args: KanbanServiceGetManyArgs): Promise<Kanban[]>;
  addOne(args: KanbanServiceAddOneInput): Promise<void>;
  // shares arg and output types with kanbanCanonService same operation
  updateCardPositions(id: string, input: KanbanCanonServiceUpdateCardPositionsInput): Promise<KanbanCardPositions>;
  deleteOne(id: string): Promise<boolean>;
}
