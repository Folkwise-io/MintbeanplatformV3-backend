import {
  KanbanCanonCardServiceAddOneInput,
  KanbanCanonCardServiceGetManyArgs,
  KanbanCanonCardServiceGetOneArgs,
} from "../service/KanbanCanonCardService";
import { KanbanCanonCard } from "../types/gqlGeneratedTypes";

export default interface KanbanCanonCardDao {
  getOne(args: KanbanCanonCardServiceGetOneArgs): Promise<KanbanCanonCard>;
  getMany(args: KanbanCanonCardServiceGetManyArgs): Promise<KanbanCanonCard[]>;
  addOne(args: KanbanCanonCardServiceAddOneInput): Promise<KanbanCanonCard>;
  // Testing methods for TestManager to call
  addMany(kanbanCanonCards: KanbanCanonCard[]): Promise<void>;
  deleteAll(): Promise<void>;
}
