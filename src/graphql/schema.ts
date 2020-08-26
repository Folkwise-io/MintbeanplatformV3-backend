import { makeExecutableSchema } from "apollo-server-express";
import user from "./typedefs/user";
import userResolver from "./resolvers/userResolver";
import { GraphQLSchema } from "graphql/type";

const schema: GraphQLSchema = makeExecutableSchema({
  typeDefs: [user],

  // Unfortunately we must cast our nicely typed Resolvers as "any" to be
  // accepted by the makeExecutableSchema fn
  resolvers: [userResolver as any],
});

export default schema;
