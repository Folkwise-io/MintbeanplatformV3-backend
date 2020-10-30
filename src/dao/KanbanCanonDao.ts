import {
  KanbanCanonServiceAddOneInput,
  KanbanCanonServiceEditOneInput,
  KanbanCanonServiceGetOneArgs,
} from "../service/KanbanCanonService";
import { KanbanCanon } from "../types/gqlGeneratedTypes";

export default interface KanbanCanonDao {
  getOne(args: KanbanCanonServiceGetOneArgs): Promise<KanbanCanon>;
  getMany(): Promise<KanbanCanon[]>;
  addOne(input: KanbanCanonServiceAddOneInput): Promise<KanbanCanon>;
  editOne(id: string, input: KanbanCanonServiceEditOneInput): Promise<KanbanCanon>;
  deleteOne(id: string): Promise<boolean>;
  // Testing methods for TestManager to call
  addMany(kanbanCanons: KanbanCanon[]): Promise<void>;
  deleteAll(): Promise<void>;
}
