import { ApolloServer } from "apollo-server-express";
import { GraphQLSchema } from "graphql";
import { BuildExpressServerContext } from "./buildServerContext";
import depthLimit from "graphql-depth-limit";

export default function buildApolloServer(schema: GraphQLSchema, context: BuildExpressServerContext): ApolloServer {
  const apolloServer = new ApolloServer({
    schema,
    context,
    validationRules: [depthLimit(4)],
  });

  return apolloServer;
}
