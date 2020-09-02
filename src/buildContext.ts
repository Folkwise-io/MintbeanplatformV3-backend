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
import UserService from "./service/UserService";
import UserDao from "./dao/UserDao";
import UserResolverValidator from "./validator/UserResolverValidator";

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
  userResolverValidator: UserResolverValidator;
  userService: UserService;
}

export function buildResolverContext(persistenceContext: PersistenceContext): ResolverContext {
  const { userDao } = persistenceContext;
  const userResolverValidator = new UserResolverValidator(userDao);
  const userService = new UserService(userDao);

  return {
    userResolverValidator,
    userService,
  };
}

export function buildSchema(resolverContext: ResolverContext): GraphQLSchema {
  const { userService, userResolverValidator } = resolverContext;
  const typeDefs = [customScalars, user, post];
  const resolvers = [
    customScalarsResolver, // Defines resolver (i.e. validation) for custom scalars
    userResolver(userResolverValidator, userService),
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
