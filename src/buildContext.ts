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
import UserDaoImpl from "./dao/UserDaoImpl";
import UserResolverValidator from "./validator/UserResolverValidator";
import UserDao from "./dao/UserDao";

export interface PersistenceContext {
  userDao: UserDao;
  knex: Knex;
}

export interface ResolverContext {
  userResolverValidator: UserResolverValidator;
  userService: UserService;
}

export function buildPersistenceContext(): PersistenceContext {
  const knex = Knex(knexConfig);
  const userDao = new UserDaoImpl(knex);

  return {
    userDao,
    knex,
  };
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

// TODO: Refactor into a buildSchema.ts file
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

// TODO: Refactor into a buildServer.ts file
export function buildServer(schema: GraphQLSchema): ApolloServer {
  const apolloServer = new ApolloServer({
    schema,
  });

  return apolloServer;
}
