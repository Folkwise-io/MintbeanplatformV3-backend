import { makeExecutableSchema } from "apollo-server-express";
import hello from "./typedefs/hello";
import helloResolver from "./resolvers/helloResolver";

const schema = makeExecutableSchema({
  typeDefs: [hello],
  resolvers: [helloResolver],
});

export default schema;
