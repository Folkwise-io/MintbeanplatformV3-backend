import { ApolloError } from "apollo-server-express";
import MeetService from "../../service/MeetService";
import { Meet, Resolvers } from "../../types/gqlGeneratedTypes";
import MeetResolverValidator from "../../validator/MeetResolverValidator";

const meetResolver = (meetResolverValidator: MeetResolverValidator, meetService: MeetService): Resolvers => {
  return {
    Query: {
      meets: (_root, _args, _context): Promise<Meet[]> => {
        return meetService.getMany(_args, _context);
      },
    },
  };
};

export default meetResolver;
