import { Resolvers } from "../../types/gqlGeneratedTypes";
import KanbanCanonCardService from "../../service/KanbanCanonCardService";

const kanbanCardResolver = (kanbanCanonCardService: KanbanCanonCardService): Resolvers => {
  return {
    Kanban: {
      kanbanCards: (kanban) => {
        return kanbanCanonCardService.getMany({ kanbanCanonId: kanban.kanbanCanonId });
      },
    },
  };
};

export default kanbanCardResolver;
