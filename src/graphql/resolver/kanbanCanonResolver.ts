import { ServerContext } from "../../buildServerContext";
import { KanbanCanon, KanbanCardPositions, Resolvers } from "../../types/gqlGeneratedTypes";
import KanbanCanonService from "../../service/KanbanCanonService";
import KanbanCanonResolverValidator from "../../validator/KanbanCanonResolverValidator";
import KanbanCanonDao from "../../dao/KanbanCanonDao";

const kanbanCanonResolver = (
  kanbanCanonResolverValidator: KanbanCanonResolverValidator,
  kanbanCanonService: KanbanCanonService,
  kanbanCanonDao: KanbanCanonDao,
): Resolvers => {
  return {
    Query: {
      kanbanCanon: (_root, args, _context: ServerContext): Promise<KanbanCanon> => {
        return kanbanCanonDao.getOne(args);
      },
      kanbanCanons: (_root, _args, _context: ServerContext): Promise<KanbanCanon[]> => {
        return kanbanCanonDao.getMany();
      },
    },

    Mutation: {
      createKanbanCanon: (_root, args, context: ServerContext): Promise<KanbanCanon> => {
        return kanbanCanonResolverValidator.addOne(args, context).then(({ input }) => kanbanCanonService.addOne(input));
      },
      editKanbanCanon: (_root, args, context: ServerContext): Promise<KanbanCanon> => {
        return kanbanCanonResolverValidator
          .editOne(args, context)
          .then(({ id, input }) => kanbanCanonDao.editOne(id, input));
      },
      updateKanbanCanonCardPositions: (_root, args, context: ServerContext): Promise<KanbanCardPositions> => {
        return kanbanCanonResolverValidator
          .updateCardPositions(args, context)
          .then(({ id, input }) => kanbanCanonDao.updateCardPositions(id, input));
      },
    },

    Meet: {
      kanbanCanon: (meet) => {
        // return null if no kanbanCanon associated with this meet
        if (!meet.kanbanCanonId) return null;
        return kanbanCanonDao.getOne({ id: meet.kanbanCanonId });
      },
    },
  };
};

export default kanbanCanonResolver;
