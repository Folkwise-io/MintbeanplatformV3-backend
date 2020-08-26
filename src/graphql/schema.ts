import { makeExecutableSchema, gql } from "apollo-server-express";
import hello from "./typedefs/hello";
import helloResolver from "./resolvers/helloResolver";
import user from "./typedefs/user";
import userResolver from "./resolvers/userResolver";

const schema = makeExecutableSchema({
  typeDefs: [hello, user],
  resolvers: [helloResolver, userResolver],
});

export default schema;
