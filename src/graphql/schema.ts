import { makeExecutableSchema } from "apollo-server-express";
import { GraphQLSchema } from "graphql/type";
import user from "./typedefs/user";
import userResolver from "./resolvers/userResolver";
import post from "./typedefs/post";
import postResolver from "./resolvers/postResolver";

const schema: GraphQLSchema = makeExecutableSchema({
  typeDefs: [user, post],

  // Unfortunately we must cast our nicely typed Resolvers as "any" to be
  // accepted by the makeExecutableSchema fn
  resolvers: [userResolver as any, postResolver as any],
});

export default schema;
