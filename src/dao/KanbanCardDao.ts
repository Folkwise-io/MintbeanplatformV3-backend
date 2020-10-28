import { KanbanCardServiceGetManyArgs, KanbanCardServiceGetOneArgs } from "../service/KanbanCardService";
import { KanbanCard } from "../types/gqlGeneratedTypes";

// for adding many kanbans in test manager
export interface KanbanSessionCardRaw {
  id: string;
  kanbanCanonCardId: string;
  kanbanId: string;
  status?: string;
  createdAt?: string;
  updatedAt?: string;
}

export default interface KanbanCardDao {
  getMany(args: KanbanCardServiceGetManyArgs): Promise<KanbanCard[]>;
  // getOne(args: KanbanCardServiceGetOneArgs): Promise<KanbanCard>;
  // addOne(args: KanbanCardServiceAddOneArgs): Promise<KanbanCard>;
  // Testing methods for TestManager to call
  addMany(kanbanCards: KanbanSessionCardRaw[]): Promise<void>;
  deleteAll(): Promise<void>;
}
