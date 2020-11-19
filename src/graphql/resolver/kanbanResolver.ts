import { ServerContext } from "../../buildServerContext";
import { Kanban, KanbanCardPositions, Resolvers } from "../../types/gqlGeneratedTypes";
import KanbanService from "../../service/KanbanService";
import KanbanResolverValidator from "../../validator/KanbanResolverValidator";
import KanbanDao from "../../dao/KanbanDao";

const kanbanResolver = (
  kanbanResolverValidator: KanbanResolverValidator,
  kanbanService: KanbanService,
  kanbanDao: KanbanDao,
): Resolvers => {
  return {
    Query: {
      kanban: (_root, args, context: ServerContext): Promise<Kanban | null> => {
        return kanbanResolverValidator
          .getOne(args, context)
          .then((args) => kanbanDao.getOne(args))
          .then((result) => (result ? result : null));
      },
      kanbans: (_root, args, context: ServerContext): Promise<Kanban[]> => {
        return kanbanResolverValidator.getMany(args, context).then((args) => kanbanDao.getMany(args));
      },
    },

    Mutation: {
      createKanban: (_root, args, context: ServerContext): Promise<Kanban> => {
        return kanbanResolverValidator.addOne(args, context).then(({ input }) => kanbanService.addOne(input));
      },

      updateKanbanCardPositions: (_root, args, context: ServerContext): Promise<KanbanCardPositions> => {
        return kanbanResolverValidator
          .updateKanbanCardPositions(args, context)
          .then(({ id, input }) => kanbanDao.updateCardPositions(id, input));
      },

      deleteKanban: (_root, args, context: ServerContext): Promise<boolean> => {
        return kanbanResolverValidator.deleteOne(args, context).then(({ id }) => kanbanDao.deleteOne(id));
      },
    },

    Meet: {
      kanban: (meet, _args, context) => {
        // Return null if this meet does not have a kanbanCanon
        if (!meet.kanbanCanonId) return null;
        // Return null if no logged in user maing request kanbanCanon
        if (!context.getUserId()) return null;
        // retrieve kanban of requesting user
        const requesterId = context.getUserId();
        return kanbanDao
          .getOne({ meetId: meet.id, kanbanCanonId: meet.kanbanCanonId, userId: requesterId })
          .then((result) => (result ? result : null));
      },
    },
  };
};

export default kanbanResolver;
