import { KanbanCardServiceGetManyArgs, KanbanCardServiceGetOneArgs } from "../service/KanbanCardService";
import { KanbanCard } from "../types/gqlGeneratedTypes";

export default interface KanbanCardDao {
  getOne(args: KanbanCardServiceGetOneArgs): Promise<KanbanCard>;
  getMany(args: KanbanCardServiceGetManyArgs): Promise<KanbanCard[]>;
  // addOne(args: KanbanCardServiceAddOneArgs): Promise<KanbanCard>;
  // Testing methods for TestManager to call
  addMany(kanbanCards: KanbanCard[]): Promise<void>;
  deleteAll(): Promise<void>;
}
