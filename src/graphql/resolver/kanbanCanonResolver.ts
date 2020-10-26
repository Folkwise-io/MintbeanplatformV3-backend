import { AuthenticationError } from "apollo-server-express";
import { ServerContext } from "../../buildServerContext";
import { EmailService } from "../../service/EmailService";
import MeetRegistrationService from "../../service/MeetRegistrationService";
import MeetService from "../../service/MeetService";
import UserService from "../../service/UserService";
import { KanbanCanon, Resolvers } from "../../types/gqlGeneratedTypes";
import MeetResolverValidator from "../../validator/MeetResolverValidator";
import config from "../../util/config";
import KanbanCanonService from "../../service/KanbanCanonService";
const { disableRegistrationEmail } = config;

const kanbanCanonResolver = (kanbanCanonService: KanbanCanonService): Resolvers => {
  return {
    Query: {
      kanbanCanon: (_root, args, context: ServerContext): Promise<KanbanCanon> => {
        // TODO: validate?
        return kanbanCanonService.getOne(args);
      },
      kanbanCanons: (_root, args, context: ServerContext): Promise<KanbanCanon[]> => {
        return kanbanCanonService.getMany();
      },
    },

    // Mutation: {
    //   createMeet: (_root, args, context: ServerContext): Promise<Meet> => {
    //     if (!context.getIsAdmin()) {
    //       throw new AuthenticationError("You are not authorized to create new meets!");
    //     }

    //     return kanbanCanonResolverValidator.addOne(args, context).then((input) => meetService.addOne(input));
    //   },
    //   editMeet: (_root, args, context: ServerContext): Promise<Meet> => {
    //     if (!context.getIsAdmin()) {
    //       throw new AuthenticationError("You are not authorized to edit meets!");
    //     }

    //     return kanbanCanonResolverValidator
    //       .editOne(args, context)
    //       .then(({ id, input }) => meetService.editOne(id, input));
    //   },
    //   deleteMeet: (_root, args, context: ServerContext): Promise<boolean> => {
    //     if (!context.getIsAdmin()) {
    //       throw new AuthenticationError("You are not authorized to delete meets!");
    //     }

    //     return kanbanCanonResolverValidator.deleteOne(args).then((id) => meetService.deleteOne(id));
    //   },
    // },

    Meet: {
      kanbanCanon: (meet) => {
        return kanbanCanonService.getOne({ id: meet.kanbanCanonId });
      },
    },
  };
};

export default kanbanCanonResolver;
