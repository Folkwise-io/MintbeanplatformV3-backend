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

    // Mutation: {
    //   createMeet: (_root, args, context: ServerContext): Promise<Meet> => {
    //     if (!context.getIsAdmin()) {
    //       throw new AuthenticationError("You are not authorized to create new meets!");
    //     }

    //     return kanbanCanonCardResolverValidator.addOne(args, context).then((input) => meetService.addOne(input));
    //   },
    //   editMeet: (_root, args, context: ServerContext): Promise<Meet> => {
    //     if (!context.getIsAdmin()) {
    //       throw new AuthenticationError("You are not authorized to edit meets!");
    //     }

    //     return kanbanCanonCardResolverValidator
    //       .editOne(args, context)
    //       .then(({ id, input }) => meetService.editOne(id, input));
    //   },
    //   deleteMeet: (_root, args, context: ServerContext): Promise<boolean> => {
    //     if (!context.getIsAdmin()) {
    //       throw new AuthenticationError("You are not authorized to delete meets!");
    //     }

    //     return kanbanCanonCardResolverValidator.deleteOne(args).then((id) => meetService.deleteOne(id));
    //   },
    // },

    KanbanCanon: {
      kanbanCanonCards: (kanbanCanon) => {
        return kanbanCanonCardService.getMany({ kanbanCanonId: kanbanCanon.id });
      },
    },
  };
};

export default kanbanCanonCardResolver;
