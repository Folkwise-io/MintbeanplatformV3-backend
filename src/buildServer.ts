import { ApolloServer } from "apollo-server-express";
import { GraphQLSchema } from "graphql";

export default function buildServer(schema: GraphQLSchema): ApolloServer {
  const apolloServer = new ApolloServer({
    schema,
  });

  return apolloServer;
}
