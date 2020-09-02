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
import UserValidator from "./validator/UserValidator";

interface PersistenceContext {
  userDao: UserDao;
}

export function buildPersistenceContext(): PersistenceContext {
  const knex = Knex(knexConfig);
  const userDao = new UserDao(knex);

  return {
    userDao,
  };
}

interface ResolverContext {
  userResolverService: UserResolverService;
  userValidator: UserValidator;
}

export function buildResolverContext(persistenceContext: PersistenceContext): ResolverContext {
  const { userDao } = persistenceContext;
  const userResolverService = new UserResolverService(userDao);
  const userValidator = new UserValidator(userDao);

  return {
    userResolverService,
    userValidator,
  };
}

export function buildSchema(resolverContext: ResolverContext): GraphQLSchema {
  const { userResolverService, userValidator } = resolverContext;
  const typeDefs = [customScalars, user, post];
  const resolvers = [
    customScalarsResolver, // Defines resolver (i.e. validation) for custom scalars
    userResolver(userValidator, userResolverService),
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
