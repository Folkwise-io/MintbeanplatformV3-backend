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
        if (context.getIsAdmin()) {
          return meetResolverValidator.addOne(args, context).then((input) => meetService.addOne(input, context));
        } else {
          throw new AuthenticationError("You are not authorized to create new meets!");
        }
      },
    },
  };
};

export default meetResolver;
