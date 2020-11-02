import { ServerContext } from "../../buildServerContext";
import { Kanban, Resolvers } from "../../types/gqlGeneratedTypes";
import KanbanService from "../../service/KanbanService";
import KanbanResolverValidator from "../../validator/KanbanResolverValidator";

const kanbanResolver = (kanbanResolverValidator: KanbanResolverValidator, kanbanService: KanbanService): Resolvers => {
  return {
    Query: {
      kanban: (_root, args, context: ServerContext): Promise<Kanban> => {
        return kanbanResolverValidator.getOne(args, context).then((args) => kanbanService.getOne(args));
      },
      kanbans: (_root, args, context: ServerContext): Promise<Kanban[]> => {
        return kanbanResolverValidator.getMany(args, context).then((args) => kanbanService.getMany(args));
      },
    },

    Mutation: {
      createKanban: (_root, args, context: ServerContext): Promise<Kanban> => {
        return kanbanResolverValidator.addOne(args, context).then(({ input }) => kanbanService.addOne(input));
      },

      deleteKanban: (_root, args, context: ServerContext): Promise<boolean> => {
        return kanbanResolverValidator.deleteOne(args, context).then(({ id }) => kanbanService.deleteOne(id));
      },
    },

    Meet: {
      kanban: (meet, _args, context) => {
        // retrieve kanban of requesting user
        const requesterId = context.getUserId();
        return kanbanService.getOne({ meetId: meet.id, kanbanCanonId: meet.kanbanCanonId, userId: requesterId });
      },
    },
  };
};

export default kanbanResolver;
