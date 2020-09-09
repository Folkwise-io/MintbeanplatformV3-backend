// Resolvers for custom scalars define the form of a scalar. This allows GraphQL to do a typecheck validation and
// return an error with code 'GRAPHQL_VALIDATION_FAILED' if a query passes in a malformed value.
import { Resolvers } from "../../types/gqlGeneratedTypes";
import GraphQLUUID from "graphql-type-uuid";
import { GraphQLScalarType } from "graphql";

const customScalarsResolver: Resolvers = {
  UUID: GraphQLUUID as GraphQLScalarType,
};

export default customScalarsResolver;
