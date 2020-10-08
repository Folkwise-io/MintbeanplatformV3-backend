import { KanbanCard } from "../types/gqlGeneratedTypes";
import { KanbanServiceAddOneInput, KanbanServiceEditOneInput, KanbanServiceGetOneArgs } from "../service/KanbanService";

export default interface KanbanDao {
  getOne(args: KanbanServiceGetOneArgs): Promise<KanbanCard>;
  getMany(): Promise<KanbanCard[]>;
  addOne(args: KanbanServiceAddOneInput): Promise<KanbanCard>;
  editOne(id: string, input: KanbanServiceEditOneInput): Promise<KanbanCard>;
  deleteOne(id: string): Promise<boolean>;

  // Below are TestManager methods
  deleteAll(): Promise<void>;
  addMany(kanbans: KanbanCard[]): Promise<void>;
}
