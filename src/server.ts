import { ApolloServer } from "apollo-server-express";
import schema from "./graphql/schema";

const apolloServer = new ApolloServer({ schema, tracing: true });

export default apolloServer;
