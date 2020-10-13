import { AuthenticationError } from "apollo-server-express";
import { ServerContext } from "../../buildServerContext";
import KanbanSessionCardService from "../../service/KanbanSessionCardService";
import { KanbanSessionCard, Resolvers } from "../../types/gqlGeneratedTypes";
import KanbanSessionCardResolverValidator from "../../validator/KanbanSessionCardResolverValidator";

interface SortedCards {
  TODO: KanbanSessionCard[];
  WIP: KanbanSessionCard[];
  DONE: KanbanSessionCard[];
}
const kanbanSessionCardResolver = (
  kanbanSessionCardResolverValidator: KanbanSessionCardResolverValidator,
  kanbanSessionCardService: KanbanSessionCardService,
): Resolvers => {
  return {
    Query: {
      // TODO: Show "deleted=true" meets for admin? Currently this query does not get Meets with "deleted=true"
      kanbanSessionCards: (_root, args, context: ServerContext): Promise<KanbanSessionCard[]> => {
        return kanbanSessionCardResolverValidator.getMany(args).then((args) => kanbanSessionCardService.getMany(args));
      },

      kanbanSessionCard: (_root, args, context: ServerContext): Promise<KanbanSessionCard> => {
        // admins can get a given user's kanban sessions by specificying a userId in args
        return kanbanSessionCardResolverValidator.getOne(args).then((args) => kanbanSessionCardService.getOne(args));
      },
    },

    Mutation: {
      createKanbanSessionCard: (_root, args, context: ServerContext): Promise<KanbanSessionCard> => {
        if (!context.getIsAdmin()) {
          throw new AuthenticationError("You are not authorized to create new kanbanSession cards!");
        }

        return kanbanSessionCardResolverValidator
          .addOne(args, context)
          .then((input) => kanbanSessionCardService.addOne(input));
      },
      editKanbanSessionCard: (_root, args, context: ServerContext): Promise<KanbanSessionCard> => {
        if (!context.getIsAdmin()) {
          throw new AuthenticationError("You are not authorized to edit kanbanSessions!");
        }

        return kanbanSessionCardResolverValidator
          .editOne(args, context)
          .then(({ id, input }) => kanbanSessionCardService.editOne(id, input));
      },
      deleteKanbanSessionCard: (_root, args, context: ServerContext): Promise<boolean> => {
        if (!context.getIsAdmin()) {
          throw new AuthenticationError("You are not authorized to delete kanbanSession cards!");
        }

        return kanbanSessionCardResolverValidator.deleteOne(args).then((id) => kanbanSessionCardService.deleteOne(id));
      },
    },

    KanbanSession: {
      kanbanSessionCards: (kanbanSession) => {
        return kanbanSessionCardService.getMany({
          kanbanSessionId: kanbanSession.id,
        });
      },
    },
  };
};

export default kanbanSessionCardResolver;

// KanbanSession: {
//       kanbanSessionCards: async (kanbanSession) => {
//         const unsortedCards: KanbanSessionCard[] = await kanbanSessionCardService.getMany({
//           kanbanSessionId: kanbanSession.id,
//         });
//         const sortedCardsRaw: SortedCards = {
//           TODO: [],
//           WIP: [],
//           DONE: [],
//         };
//         unsortedCards.forEach((card) => {
//           sortedCardsRaw[card.status].push(card);
//         });
//         const sortedCards = {
//           todoCards: sortedCardsRaw.TODO,
//           wipCards: sortedCardsRaw.WIP,
//           doneCards: sortedCardsRaw.DONE,
//         };
//         return sortedCards;
//       },
//     },
