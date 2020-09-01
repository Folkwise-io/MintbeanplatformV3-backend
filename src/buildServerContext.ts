import { ApolloServer } from "apollo-server-express";
import schema from "./graphql/schema";

export interface ServerContext {
  server: ApolloServer;
}

export default function buildServerContext(): ServerContext {
  // TODO: call every builder function in here only
  const apolloServer = new ApolloServer({ schema, tracing: true });

  return {
    server: apolloServer,
    // TODO: return other useful things in the future
  };
}
