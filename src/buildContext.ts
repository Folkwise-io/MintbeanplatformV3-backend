import Knex from "knex";
import knexConfig from "./db/knexfile";
import UserService from "./service/UserService";
import UserDaoKnex from "./dao/UserDaoKnex";
import UserResolverValidator from "./validator/UserResolverValidator";
import UserDao from "./dao/UserDao";
import { Request, Response } from "express";

export interface PersistenceContext {
  userDao: UserDao;
}

export function buildPersistenceContext(): PersistenceContext {
  const knex = Knex(knexConfig);
  const userDao = new UserDaoKnex(knex);

  return {
    userDao,
  };
}

export interface ResolverContext {
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

export interface ExpressContext {
  req: Request;
  res: Response;
}

export interface ServerContext {
  req: Request;
  res: Response;
  // TODO: maybe parse the user from req cookie and send user, instead of sending req down to resolvers
}

export type BuildExpressServerContext = (expressContext: ExpressContext) => ServerContext;

export const buildServerContext: BuildExpressServerContext = function ({
  req,
  res,
}: {
  req: Request;
  res: Response;
}): ServerContext {
  return { req, res };
};
