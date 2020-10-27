// A "Kanban" is pieced together by kanbanCanon and kanbanSession data from the DB to build a personalized view of a kanban

import { KanbanServiceGetOneArgs, KanbanServiceGetManyArgs } from "../service/KanbanService";
import { Kanban } from "../types/gqlGeneratedTypes";

export default interface KanbanDao {
  getOne(args: KanbanServiceGetOneArgs): Promise<Kanban>;
  getMany(args: KanbanServiceGetManyArgs): Promise<Kanban[]>;
  //   addOne(args: KanbanServiceAddOneArgs): Promise<Kanban>;
  // Testing methods for TestManager to call
  addMany(users: Kanban[]): Promise<void>;
  deleteAll(): Promise<void>;
}
