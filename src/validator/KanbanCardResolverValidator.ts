import { ServerContext } from "../buildServerContext";
import KanbanCardDao from "../dao/KanbanCardDao";
import KanbanDao from "../dao/KanbanDao";
import { KanbanCardServiceGetManyArgs } from "../service/KanbanCardService";
import { Kanban } from "../types/gqlGeneratedTypes";
import { ensureExists } from "../util/ensureExists";

export default class KanbanCardResolverValidator {
  constructor(private kanbanCardDao: KanbanCardDao, private kanbanDao: KanbanDao) {}

  async getMany(
    { kanbanId }: KanbanCardServiceGetManyArgs,
    _context: ServerContext,
  ): Promise<KanbanCardServiceGetManyArgs> {
    await this.kanbanDao.getOne({ id: kanbanId }).then((kanban) => ensureExists<Kanban>("Kanban")(kanban));
    return { kanbanId };
  }
}
