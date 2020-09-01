import { ApolloServer, makeExecutableSchema } from "apollo-server-express";
import { GraphQLSchema } from "graphql";
import Knex from "knex";
import knexConfig from "./db/knexfile";
import customScalarsResolver from "./graphql/resolver/customScalarsResolver";
import userResolver from "./graphql/resolver/userResolver";
import postResolver from "./graphql/resolver/postResolver";
import user from "./graphql/typedef/user";
import post from "./graphql/typedef/post";
import customScalars from "./graphql/typedef/customScalars";
import UserResolverService from "./service/UserResolverService";
import UserDao from "./dao/UserDao";

export interface ServerContext {
  server: ApolloServer;
  schema: GraphQLSchema;
}

function buildPersistenceContext() {
  const knex = Knex(knexConfig);
  const userDao = new UserDao(knex);
  return { userDao };
}

export default function buildServerContext(): ServerContext {
  const { userDao } = buildPersistenceContext();
  const userResolverService = new UserResolverService(userDao);

  const typeDefs = [customScalars, user, post];
  const resolvers = [
    customScalarsResolver, // Defines resolver (i.e. validation) for custom scalars
    userResolver(userResolverService),
    postResolver, // TODO: pass in postResolverService
  ];

  const schema = makeExecutableSchema({
    typeDefs,
    resolvers: resolvers as any,
  });

  const apolloServer = new ApolloServer({
    schema,
    tracing: true,
  });

  return {
    server: apolloServer,
    schema,
  };
}
