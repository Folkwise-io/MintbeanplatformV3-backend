// Resolvers for custom scalars define the form of a scalar. This allows GraphQL to do a typecheck validation and
// return an error with code 'GRAPHQL_VALIDATION_FAILED' if a query passes in a malformed value.
import { Resolvers } from "../generated/tsTypes";
import GraphQLUUID from "graphql-type-uuid";

const customScalarsResolver: Resolvers = {
  UUID: GraphQLUUID as any,
};

export default customScalarsResolver;
