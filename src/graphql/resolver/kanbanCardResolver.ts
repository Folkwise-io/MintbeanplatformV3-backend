import { Resolvers } from "../../types/gqlGeneratedTypes";
import KanbanCanonCardDao from "../../dao/KanbanCanonCardDao";

const kanbanCardResolver = (kanbanCanonCardDao: KanbanCanonCardDao): Resolvers => {
  return {
    Kanban: {
      kanbanCards: (kanban) => {
        return kanbanCanonCardDao.getMany({ kanbanCanonId: kanban.kanbanCanonId });
      },
    },
  };
};

export default kanbanCardResolver;
