import { KanbanSession } from "../types/gqlGeneratedTypes";
import { KanbanServiceAddOneInput, KanbanServiceEditOneInput, KanbanServiceGetOneArgs } from "../service/KanbanService";

export default interface KanbanDao {
  getOne(args: KanbanServiceGetOneArgs): Promise<KanbanSession>;
  getMany(): Promise<KanbanSession[]>;
  addOne(args: KanbanServiceAddOneInput): Promise<KanbanSession>;
  editOne(id: string, input: KanbanServiceEditOneInput): Promise<KanbanSession>;
  deleteOne(id: string): Promise<boolean>;

  // Below are TestManager methods
  deleteAll(): Promise<void>;
  addMany(kanbans: KanbanSession[]): Promise<void>;
}
