import { makeExecutableSchema } from "apollo-server-express";
import { GraphQLSchema } from "graphql/type";
import user from "./typedef/user";
import userResolver from "./resolver/userResolver";
import post from "./typedef/post";
import postResolver from "./resolver/postResolver";
import customScalarsResolver from "./resolver/customScalarsResolver";
import customScalars from "./typedef/customScalars";

const schema: GraphQLSchema = makeExecutableSchema({
  typeDefs: [customScalars, user, post],

  // Unfortunately we must cast our nicely typed Resolvers as "any" to be
  // accepted by the makeExecutableSchema fn
  resolvers: [
    // Define resolver (i.e. validation) for custom scalars
    customScalarsResolver as any,
    userResolver as any,
    postResolver as any,
  ],
});

export default schema;
