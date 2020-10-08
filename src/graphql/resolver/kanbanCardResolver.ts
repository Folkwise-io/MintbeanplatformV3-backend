import { AuthenticationError } from "apollo-server-express";
import { ServerContext } from "../../buildServerContext";
import KanbanCardService from "../../service/KanbanCardService";
import { KanbanCard, Resolvers } from "../../types/gqlGeneratedTypes";
import KanbanCardResolverValidator from "../../validator/KanbanCardResolverValidator";

const kanbanCardResolver = (
  kanbanCardResolverValidator: KanbanCardResolverValidator,
  kanbanCardService: KanbanCardService,
): Resolvers => {
  return {
    Query: {
      // TODO: Show "deleted=true" meets for admin? Currently this query does not get Meets with "deleted=true"
      kanbanCards: (_root, args, context: ServerContext): Promise<KanbanCard[]> => {
        return kanbanCardResolverValidator.getMany(args).then((args) => kanbanCardService.getMany(args));
      },

      kanbanCard: (_root, args, context: ServerContext): Promise<KanbanCard> => {
        return kanbanCardResolverValidator.getOne(args).then((args) => kanbanCardService.getOne(args));
      },
    },

    Mutation: {
      createKanbanCard: (_root, args, context: ServerContext): Promise<KanbanCard> => {
        if (!context.getIsAdmin()) {
          throw new AuthenticationError("You are not authorized to create new kanban cards!");
        }

        return kanbanCardResolverValidator.addOne(args, context).then((input) => kanbanCardService.addOne(input));
      },
      editKanbanCard: (_root, args, context: ServerContext): Promise<KanbanCard> => {
        if (!context.getIsAdmin()) {
          throw new AuthenticationError("You are not authorized to edit kanbans!");
        }

        return kanbanCardResolverValidator
          .editOne(args, context)
          .then(({ id, input }) => kanbanCardService.editOne(id, input));
      },
      deleteKanbanCard: (_root, args, context: ServerContext): Promise<boolean> => {
        if (!context.getIsAdmin()) {
          throw new AuthenticationError("You are not authorized to delete kanban cards!");
        }

        return kanbanCardResolverValidator.deleteOne(args).then((id) => kanbanCardService.deleteOne(id));
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
