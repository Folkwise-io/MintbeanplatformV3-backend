import { ApolloServer } from "apollo-server-express";
import { GraphQLSchema } from "graphql";
import { BuildExpressServerContext } from "./buildServerContext";

export default function buildApolloServer(schema: GraphQLSchema, context: BuildExpressServerContext): ApolloServer {
  const apolloServer = new ApolloServer({
    schema,
    context,
  });

  return apolloServer;
}
