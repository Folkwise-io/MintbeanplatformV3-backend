import { ServerContext } from "../../buildServerContext";
import { KanbanCanonCard, Resolvers } from "../../types/gqlGeneratedTypes";
import KanbanCanonCardService from "../../service/KanbanCanonCardService";
import KanbanCanonCardResolverValidator from "../../validator/KanbanCanonCardResolverValidator";

const kanbanCanonCardResolver = (
  kanbanCanonCardResolverValidator: KanbanCanonCardResolverValidator,
  kanbanCanonCardService: KanbanCanonCardService,
): Resolvers => {
  return {
    Query: {
      kanbanCanonCard: (_root, args, context: ServerContext): Promise<KanbanCanonCard> => {
        // TODO: validate?
        return kanbanCanonCardResolverValidator
          .getOne(args, context)
          .then((args) => kanbanCanonCardService.getOne(args));
      },
      kanbanCanonCards: (_root, args, context: ServerContext): Promise<KanbanCanonCard[]> => {
        return kanbanCanonCardResolverValidator
          .getMany(args, context)
          .then((args) => kanbanCanonCardService.getMany(args));
      },
    },

    Mutation: {
      createKanbanCanonCard: (_root, args, context: ServerContext): Promise<KanbanCanonCard> => {
        return kanbanCanonCardResolverValidator
          .addOne(args, context)
          .then(({ input }) => kanbanCanonCardService.addOne(input));
      },
      editKanbanCanonCard: (_root, args, context: ServerContext): Promise<KanbanCanonCard> => {
        return kanbanCanonCardResolverValidator
          .editOne(args, context)
          .then(({ id, input }) => kanbanCanonCardService.editOne(id, input));
      },
      // deleteMeet: (_root, args, context: ServerContext): Promise<boolean> => {
      //   if (!context.getIsAdmin()) {
      //     throw new AuthenticationError("You are not authorized to delete meets!");
      //   }
      //   return kanbanCanonCardResolverValidator.deleteOne(args).then((id) => meetService.deleteOne(id));
      // },
    },

    KanbanCanon: {
      kanbanCanonCards: (kanbanCanon) => {
        return kanbanCanonCardService.getMany({ kanbanCanonId: kanbanCanon.id });
      },
    },
  };
};

export default kanbanCanonCardResolver;
