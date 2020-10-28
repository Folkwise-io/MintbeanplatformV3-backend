import { ServerContext } from "../../buildServerContext";
import { KanbanCard, Resolvers } from "../../types/gqlGeneratedTypes";
import KanbanCardService from "../../service/KanbanCardService";
import KanbanCardResolverValidator from "../../validator/KanbanCardResolverValidator";

const kanbanCardResolver = (
  kanbanCardResolverValidator: KanbanCardResolverValidator,
  kanbanCardService: KanbanCardService,
): Resolvers => {
  return {
    Query: {
      kanbanCards: (_root, args, context: ServerContext): Promise<KanbanCard[]> => {
        return kanbanCardResolverValidator.getMany(args, context).then((args) => kanbanCardService.getMany(args));
      },
    },

    Kanban: {
      kanbanCards: (kanban) => {
        return kanbanCardService.getMany({ kanbanId: kanban.id });
      },
    },
  };
};

export default kanbanCardResolver;
