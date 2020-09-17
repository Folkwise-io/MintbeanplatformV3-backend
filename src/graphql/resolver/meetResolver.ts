import { AuthenticationError } from "apollo-server-express";
import { ServerContext } from "../../buildServerContext";
import MeetService from "../../service/MeetService";
import { Meet, Resolvers } from "../../types/gqlGeneratedTypes";
import MeetResolverValidator from "../../validator/MeetResolverValidator";

const meetResolver = (meetResolverValidator: MeetResolverValidator, meetService: MeetService): Resolvers => {
  return {
    Query: {
      meets: (_root, args, context: ServerContext): Promise<Meet[]> => {
        return meetResolverValidator.getMany(args, context).then((args) => meetService.getMany(args, context));
      },
    },

    Mutation: {
      createMeet: (_root, args, context: ServerContext): Promise<Meet> => {
        if (!context.getIsAdmin()) {
          throw new AuthenticationError("You are not authorized to create new meets!");
        }

        return meetResolverValidator.addOne(args, context).then((input) => meetService.addOne(input, context));
      },
      editMeet: (_root, args, context: ServerContext): Promise<Meet> => {
        if (!context.getIsAdmin()) {
          throw new AuthenticationError("You are not authorized to edit meets!");
        }
        return meetResolverValidator
          .editOne(args, context)
          .then(({ id, input }) => meetService.editOne(id, input, context));
      },
      deleteMeet: (_root, args, context: ServerContext): Promise<boolean> => {
        if (!context.getIsAdmin()) {
          throw new AuthenticationError("You are not authorized to delete meets!");
        }
        return meetResolverValidator.deleteOne(args).then((id) => meetService.deleteOne(id));
      },
    },
  };
};

export default meetResolver;
