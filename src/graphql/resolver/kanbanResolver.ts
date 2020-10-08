import { AuthenticationError } from "apollo-server-express";
import { ServerContext } from "../../buildServerContext";
import MeetRegistrationService from "../../service/MeetRegistrationService";
import KanbanService from "../../service/KanbanService";
import { Kanban, Resolvers } from "../../types/gqlGeneratedTypes";
import KanbanResolverValidator from "../../validator/KanbanResolverValidator";

const kanbanResolver = (kanbanResolverValidator: KanbanResolverValidator, kanbanService: KanbanService): Resolvers => {
  return {
    Query: {
      // TODO: Show "deleted=true" meets for admin? Currently this query does not get Meets with "deleted=true"
      kanbans: (_root, _args, context: ServerContext): Promise<Kanban[]> => {
        return kanbanService.getMany();
      },

      kanban: (_root, args, context: ServerContext): Promise<Kanban> => {
        return kanbanService.getOne(args);
      },
    },

    Mutation: {
      createKanban: (_root, args, context: ServerContext): Promise<Kanban> => {
        if (!context.getIsAdmin()) {
          throw new AuthenticationError("You are not authorized to create new kanbans!");
        }

        return kanbanResolverValidator.addOne(args, context).then((input) => kanbanService.addOne(input));
      },
      editKanban: (_root, args, context: ServerContext): Promise<Kanban> => {
        if (!context.getIsAdmin()) {
          throw new AuthenticationError("You are not authorized to edit kanbans!");
        }

        return kanbanResolverValidator.editOne(args, context).then(({ id, input }) => kanbanService.editOne(id, input));
      },
      deleteKanban: (_root, args, context: ServerContext): Promise<boolean> => {
        if (!context.getIsAdmin()) {
          throw new AuthenticationError("You are not authorized to delete kanbans!");
        }

        return kanbanResolverValidator.deleteOne(args).then((id) => kanbanService.deleteOne(id));
      },
    },

    Meet: {
      kanban: (meet) => {
        return kanbanService.getOne({ id: meet.kanbanId });
      },
    },
  };
};

export default kanbanResolver;
