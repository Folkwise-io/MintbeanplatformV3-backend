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

export interface PersistenceContext {
  userDao: UserDao;
}

export function buildPersistenceContext(): PersistenceContext {
  const knex = Knex(knexConfig);
  const userDao = new UserDao(knex);

  return {
    userDao,
  };
}

export interface ServiceContext {
  userResolverService: UserResolverService;
}

export function buildServiceContext(persistenceContext: PersistenceContext): ServiceContext {
  const { userDao } = persistenceContext;
  const userResolverService = new UserResolverService(userDao);

  return {
    userResolverService,
  };
}

export function buildSchema(serviceContext: ServiceContext): GraphQLSchema {
  const { userResolverService } = serviceContext;
  const typeDefs = [customScalars, user, post];
  const resolvers = [
    customScalarsResolver, // Defines resolver (i.e. validation) for custom scalars
    userResolver(userResolverService),
    postResolver, // TODO: pass in postResolverService
  ];

  return makeExecutableSchema({
    typeDefs,
    resolvers: resolvers as any,
  });
}

export function buildServer(schema: GraphQLSchema): ApolloServer {
  const apolloServer = new ApolloServer({
    schema,
    tracing: true,
  });

  return apolloServer;
}
