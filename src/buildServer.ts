import { ApolloServer } from "apollo-server-express";
import { GraphQLSchema } from "graphql";
import { BuildExpressServerContext } from "./buildContext";

export default function buildServer(schema: GraphQLSchema, context: BuildExpressServerContext): ApolloServer {
  const apolloServer = new ApolloServer({
    schema,
    context,
  });

  return apolloServer;
}
