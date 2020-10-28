import { KanbanCanonServiceGetOneArgs } from "../service/KanbanCanonService";
import { KanbanCanon } from "../types/gqlGeneratedTypes";

export default interface KanbanCanonDao {
  getOne(args: KanbanCanonServiceGetOneArgs): Promise<KanbanCanon>;
  getMany(): Promise<KanbanCanon[]>;
  //   addOne(args: KanbanCanonServiceAddOneArgs): Promise<KanbanCanon>;
  // Testing methods for TestManager to call
  addMany(kanbanCanons: KanbanCanon[]): Promise<void>;
  deleteAll(): Promise<void>;
}
