import { ServerContext } from "../../buildServerContext";
import { Kanban, Resolvers } from "../../types/gqlGeneratedTypes";
import KanbanService from "../../service/KanbanService";
import KanbanResolverValidator from "../../validator/KanbanResolverValidator";

const kanbanResolver = (kanbanResolverValidator: KanbanResolverValidator, kanbanService: KanbanService): Resolvers => {
  return {
    Query: {
      kanban: (_root, args, context: ServerContext): Promise<Kanban> => {
        return kanbanResolverValidator.getOne(args, context).then((args) => kanbanService.getOne(args));
      },
      kanbans: (_root, args, context: ServerContext): Promise<Kanban[]> => {
        return kanbanResolverValidator.getMany(args, context).then((args) => kanbanService.getMany(args));
      },
    },

    // Mutation: {
    //   createMeet: (_root, args, context: ServerContext): Promise<Meet> => {
    //     if (!context.getIsAdmin()) {
    //       throw new AuthenticationError("You are not authorized to create new meets!");
    //     }

    //     return kanbanResolverValidator.addOne(args, context).then((input) => meetService.addOne(input));
    //   },
    //   editMeet: (_root, args, context: ServerContext): Promise<Meet> => {
    //     if (!context.getIsAdmin()) {
    //       throw new AuthenticationError("You are not authorized to edit meets!");
    //     }

    //     return kanbanResolverValidator
    //       .editOne(args, context)
    //       .then(({ id, input }) => meetService.editOne(id, input));
    //   },
    //   deleteMeet: (_root, args, context: ServerContext): Promise<boolean> => {
    //     if (!context.getIsAdmin()) {
    //       throw new AuthenticationError("You are not authorized to delete meets!");
    //     }

    //     return kanbanResolverValidator.deleteOne(args).then((id) => meetService.deleteOne(id));
    //   },
    // },

    Meet: {
      kanban: (meet, context, c) => {
        // TODO: add user ID
        console.log({ context });
        console.log({ c });
        return kanbanService.getOne({ meetId: meet.id, kanbanCanonId: meet.kanbanCanonId });
      },
    },
  };
};

export default kanbanResolver;
