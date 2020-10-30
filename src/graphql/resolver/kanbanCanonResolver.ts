import { ServerContext } from "../../buildServerContext";
import { KanbanCanon, Resolvers } from "../../types/gqlGeneratedTypes";
import KanbanCanonService from "../../service/KanbanCanonService";
import KanbanCanonResolverValidator from "../../validator/KanbanCanonResolverValidator";

const kanbanCanonResolver = (
  kanbanCanonResolverValidator: KanbanCanonResolverValidator,
  kanbanCanonService: KanbanCanonService,
): Resolvers => {
  return {
    Query: {
      kanbanCanon: (_root, args, _context: ServerContext): Promise<KanbanCanon> => {
        // TODO: validate?
        return kanbanCanonService.getOne(args);
      },
      kanbanCanons: (_root, args, _context: ServerContext): Promise<KanbanCanon[]> => {
        return kanbanCanonService.getMany();
      },
    },

    Mutation: {
      createKanbanCanon: (_root, args, context: ServerContext): Promise<KanbanCanon> => {
        return kanbanCanonResolverValidator
          .addOne(args.input, context)
          .then((input) => kanbanCanonService.addOne(input));
      },

      // editMeet: (_root, args, context: ServerContext): Promise<Meet> => {
      //   if (!context.getIsAdmin()) {
      //     throw new AuthenticationError("You are not authorized to edit meets!");
      //   }

      //   return kanbanCanonResolverValidator
      //     .editOne(args, context)
      //     .then(({ id, input }) => meetService.editOne(id, input));
      // },
      // deleteMeet: (_root, args, context: ServerContext): Promise<boolean> => {
      //   if (!context.getIsAdmin()) {
      //     throw new AuthenticationError("You are not authorized to delete meets!");
      //   }

      //   return kanbanCanonResolverValidator.deleteOne(args).then((id) => meetService.deleteOne(id));
      // },
    },

    Meet: {
      kanbanCanon: (meet) => {
        return kanbanCanonService.getOne({ id: meet.kanbanCanonId });
      },
    },
  };
};

export default kanbanCanonResolver;
