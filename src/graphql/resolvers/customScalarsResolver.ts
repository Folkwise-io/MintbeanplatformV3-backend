import { Resolvers } from "../generated/tsTypes";
import GraphQLUUID from "graphql-type-uuid";

const customScalarsResolver: Resolvers = {
  UUID: GraphQLUUID as any,
};

export default customScalarsResolver;
