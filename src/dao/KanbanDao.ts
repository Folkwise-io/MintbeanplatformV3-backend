// A "Kanban" is pieced together by kanbanCanon and kanbanSession data from the DB to build a personalized view of a kanban

import { KanbanServiceGetOneArgs, KanbanServiceGetManyArgs, KanbanServiceAddOneInput } from "../service/KanbanService";
import { Kanban } from "../types/gqlGeneratedTypes";

// for adding many kanbans in test manager
export interface KanbanSessionRaw {
  id: string;
  userId: string;
  kanbanCanonId: string;
  meetId?: string;
  createdAt?: string;
  updatedAt?: string;
}

export default interface KanbanDao {
  getOne(args: KanbanServiceGetOneArgs): Promise<Kanban>;
  getMany(args: KanbanServiceGetManyArgs): Promise<Kanban[]>;
  addOne(args: KanbanServiceAddOneInput): Promise<Kanban>;
  deleteOne(id: string): Promise<boolean>;

  // Testing methods for TestManager to call
  addMany(kanbans: KanbanSessionRaw[]): Promise<void>;
  deleteAll(): Promise<void>;
}
