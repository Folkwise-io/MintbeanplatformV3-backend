import { ServerContext } from "../../buildServerContext";
import { KanbanCanon, KanbanCardPositions, Resolvers } from "../../types/gqlGeneratedTypes";
import KanbanCanonService from "../../service/KanbanCanonService";
import KanbanCanonResolverValidator from "../../validator/KanbanCanonResolverValidator";

const kanbanCanonResolver = (
  kanbanCanonResolverValidator: KanbanCanonResolverValidator,
  kanbanCanonService: KanbanCanonService,
): Resolvers => {
  return {
    Query: {
      kanbanCanon: (_root, args, _context: ServerContext): Promise<KanbanCanon> => {
        return kanbanCanonService.getOne(args);
      },
      kanbanCanons: (_root, _args, _context: ServerContext): Promise<KanbanCanon[]> => {
        return kanbanCanonService.getMany();
      },
    },

    Mutation: {
      createKanbanCanon: (_root, args, context: ServerContext): Promise<KanbanCanon> => {
        return kanbanCanonResolverValidator.addOne(args, context).then(({ input }) => kanbanCanonService.addOne(input));
      },
      editKanbanCanon: (_root, args, context: ServerContext): Promise<KanbanCanon> => {
        return kanbanCanonResolverValidator
          .editOne(args, context)
          .then(({ id, input }) => kanbanCanonService.editOne(id, input));
      },
      updateKanbanCanonCardPositions: (_root, args, context: ServerContext): Promise<KanbanCardPositions> => {
        return kanbanCanonResolverValidator
          .updateCardPositions(args, context)
          .then(({ id, input }) => kanbanCanonService.updateCardPositions(id, input));
      },
      deleteKanbanCanon: (_root, args, context: ServerContext): Promise<boolean> => {
        return kanbanCanonResolverValidator.deleteOne(args, context).then(({ id }) => kanbanCanonService.deleteOne(id));
      },
    },

    Meet: {
      kanbanCanon: (meet) => {
        // return null if no kanbanCanon associated with this meet
        if (!meet.kanbanCanonId) return null;
        return kanbanCanonService.getOne({ id: meet.kanbanCanonId });
      },
    },
  };
};

export default kanbanCanonResolver;
