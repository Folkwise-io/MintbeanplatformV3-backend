import { ServerContext } from "../../buildServerContext";
import { KanbanCanonCard, Resolvers } from "../../types/gqlGeneratedTypes";
import KanbanCanonCardService from "../../service/KanbanCanonCardService";
import KanbanCanonCardResolverValidator from "../../validator/KanbanCanonCardResolverValidator";
import KanbanCanonCardDao from "../../dao/KanbanCanonCardDao";

const kanbanCanonCardResolver = (
  kanbanCanonCardResolverValidator: KanbanCanonCardResolverValidator,
  kanbanCanonCardService: KanbanCanonCardService,
  kanbanCanonCardDao: KanbanCanonCardDao,
): Resolvers => {
  return {
    Query: {
      kanbanCanonCard: (_root, args, context: ServerContext): Promise<KanbanCanonCard> => {
        return kanbanCanonCardResolverValidator
          .getOne(args, context)
          .then((args) => kanbanCanonCardService.getOne(args));
      },
      kanbanCanonCards: (_root, args, context: ServerContext): Promise<KanbanCanonCard[]> => {
        return kanbanCanonCardResolverValidator.getMany(args, context).then((args) => kanbanCanonCardDao.getMany(args));
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
      deleteKanbanCanonCard: (_root, args, context: ServerContext): Promise<boolean> => {
        return kanbanCanonCardResolverValidator
          .deleteOne(args, context)
          .then(({ id }) => kanbanCanonCardService.deleteOne(id));
      },
    },

    KanbanCanon: {
      kanbanCanonCards: (kanbanCanon) => {
        return kanbanCanonCardDao.getMany({ kanbanCanonId: kanbanCanon.id });
      },
    },
  };
};

export default kanbanCanonCardResolver;
