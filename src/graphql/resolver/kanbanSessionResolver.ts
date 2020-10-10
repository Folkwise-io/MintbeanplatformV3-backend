import { AuthenticationError } from "apollo-server-express";
import { ServerContext } from "../../buildServerContext";
import KanbanSessionService from "../../service/KanbanSessionService";
import { KanbanSession, Resolvers } from "../../types/gqlGeneratedTypes";
import KanbanSessionResolverValidator from "../../validator/KanbanSessionResolverValidator";

const kanbanSessionResolver = (
  kanbanSessionResolverValidator: KanbanSessionResolverValidator,
  kanbanSessionService: KanbanSessionService,
): Resolvers => {
  // ensure the user of userId owns kanban session of id
  const checkKanbanSessionOwnership = async (id: string, userId: string): Promise<void> => {
    const { userId: kanbanSessionOwnerId } = await kanbanSessionService.getOne({ id });

    if (userId !== kanbanSessionOwnerId) {
      throw new AuthenticationError("You are not authorized to delete this kanban session!");
    }
  };

  return {
    Query: {
      kanbanSessions: (_root, args, context: ServerContext): Promise<KanbanSession[]> => {
        return kanbanSessionService.getMany(args);
      },

      kanbanSession: (_root, args, context: ServerContext): Promise<KanbanSession> => {
        return kanbanSessionService.getOne(args);
      },
    },

    Mutation: {
      createKanbanSession: (_root, { input }, context: ServerContext): Promise<KanbanSession> => {
        return kanbanSessionService.addOne(input);
      },
      editKanbanSession: (_root, args, context: ServerContext): Promise<KanbanSession> => {
        return kanbanSessionResolverValidator.editOne(args, context).then(async ({ id, input }) => {
          await checkKanbanSessionOwnership(id, context.getUserId());
          return kanbanSessionService.editOne(id, input);
        });
      },
      deleteKanbanSession: (_root, args, context: ServerContext): Promise<boolean> => {
        return kanbanSessionResolverValidator.deleteOne(args).then(async (id) => {
          await checkKanbanSessionOwnership(id, context.getUserId());
          return kanbanSessionService.deleteOne(id);
        });
      },
    },

    Meet: {
      kanbanSession: (meet, _args, context) => {
        const userId = context.getUserId();

        // Get user kanban session for this user if it exists
        if (userId && meet.kanbanId) {
          return kanbanSessionService.getOne({ meetId: meet.id, userId, kanbanId: meet.kanbanId });
        } else return null;
      },
    },
  };
};

export default kanbanSessionResolver;
