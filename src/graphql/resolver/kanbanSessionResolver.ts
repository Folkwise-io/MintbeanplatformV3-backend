import { AuthenticationError } from "apollo-server-express";
import { ServerContext } from "../../buildServerContext";
import KanbanSessionService from "../../service/KanbanSessionService";
import { KanbanSession, Resolvers } from "../../types/gqlGeneratedTypes";
import KanbanSessionResolverValidator from "../../validator/KanbanSessionResolverValidator";

// TODO: move admin/user permissions checks to ResolverValidator?

const kanbanSessionResolver = (
  kanbanSessionResolverValidator: KanbanSessionResolverValidator,
  kanbanSessionService: KanbanSessionService,
): Resolvers => {
  // ensure the user of userId owns kanban session of id
  const isKanbanSessionOwner = async (id: string, userId: string): Promise<boolean> => {
    const { userId: kanbanSessionOwnerId } = await kanbanSessionService.getOne({ id });
    return userId === kanbanSessionOwnerId;
  };

  return {
    Query: {
      kanbanSessions: (_root, args, context: ServerContext): Promise<KanbanSession[]> => {
        // admins can get a given user's kanban sessions by specificying a userId in args
        if (args.userId) {
          if (!context.getIsAdmin()) {
            throw new AuthenticationError("You are not authorized to get kanban sessions by user id!");
          } else {
            return kanbanSessionService.getMany(args);
          }
        }
        // otherwise cookies are used to determine current user's id and get all kanban sessions for that user
        return kanbanSessionService.getMany({ ...args, userId: context.getUserId() });
      },

      kanbanSession: (_root, args, context: ServerContext): Promise<KanbanSession> => {
        // admins can get a given user's kanban sessions by specificying a userId in args
        if (args.userId) {
          if (!context.getIsAdmin()) {
            throw new AuthenticationError("You are not authorized to get a kanban session by user id!");
          } else {
            return kanbanSessionService.getOne(args);
          }
        }
        // otherwise cookies are used to determine current user's id
        return kanbanSessionService.getOne({ ...args, userId: context.getUserId() });
      },
    },

    Mutation: {
      createKanbanSession: (_root, { input }, context: ServerContext): Promise<KanbanSession> => {
        return kanbanSessionResolverValidator
          .addOne({ input }, context)
          .then(async ({ input }) => kanbanSessionService.addOne(input));
      },
      editKanbanSession: (_root, args, context: ServerContext): Promise<KanbanSession> => {
        return kanbanSessionResolverValidator.editOne(args, context).then(async ({ id, input }) => {
          const isOwner = await isKanbanSessionOwner(id, context.getUserId());
          if (!isOwner) {
            throw new AuthenticationError(`You are not authorized to edit this kanban session!`);
          }
          return kanbanSessionService.editOne(id, input);
        });
      },
      deleteKanbanSession: (_root, args, context: ServerContext): Promise<boolean> => {
        return kanbanSessionResolverValidator.deleteOne(args).then(async (id) => {
          const isOwner = await isKanbanSessionOwner(id, context.getUserId());
          if (!isOwner) {
            throw new AuthenticationError(`You are not authorized to delete this kanban session!`);
          }
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
