import MeetService from "../../service/MeetService";
import { Meet, Resolvers } from "../../types/gqlGeneratedTypes";
import MeetResolverValidator from "../../validator/MeetResolverValidator";

const meetResolver = (meetResolverValidator: MeetResolverValidator, meetService: MeetService): Resolvers => {
  return {
    Query: {
      meets: (_root, args, context): Promise<Meet[]> => {
        return meetResolverValidator.getMany(args, context).then((args) => meetService.getMany(args, context));
      },
    },
  };
};

export default meetResolver;
