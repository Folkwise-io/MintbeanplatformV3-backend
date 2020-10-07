import { Kanban } from "../types/gqlGeneratedTypes";
import { KanbanServiceAddOneInput, KanbanServiceEditOneInput, KanbanServiceGetOneArgs } from "../service/KanbanService";

export default interface KanbanDao {
  getOne(args: KanbanServiceGetOneArgs): Promise<Kanban>;
  getMany(): Promise<Kanban[]>;
  addOne(args: KanbanServiceAddOneInput): Promise<Kanban>;
  editOne(id: string, input: KanbanServiceEditOneInput): Promise<Kanban>;
  deleteOne(id: string): Promise<boolean>;

  // Below are TestManager methods
  deleteAll(): Promise<void>;
  addMany(kanbans: Kanban[]): Promise<void>;
}
