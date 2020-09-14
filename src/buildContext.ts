import Knex from "knex";
import knexConfig from "./db/knexfile";
import UserService from "./service/UserService";
import UserDaoKnex from "./dao/UserDaoKnex";
import UserResolverValidator from "./validator/UserResolverValidator";
import UserDao from "./dao/UserDao";
import { Request, Response } from "express";
import { clearCookie, setCookie } from "./util/cookieUtils";
import { parseJwt } from "./util/jwtUtils";
import { AuthenticationError } from "apollo-server-express";

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
  setCookie: (token: string) => void;
  clearCookie: () => void;
  userId?: string;
  // TODO: include userId and maybe auth scope, which will be parsed from req cookie
}

export type BuildExpressServerContext = (expressContext: ExpressContext) => ServerContext;

export const buildExpressServerContext: BuildExpressServerContext = function ({
  req,
  res,
}: {
  req: Request;
  res: Response;
}) {
  let userId;
  const jwt: string = req.cookies.jwt;

  if (jwt) {
    try {
      const parsedToken = parseJwt(jwt);
      userId = parsedToken.sub;
    } catch (e) {
      // parseJwt throws an error in case of signature mismatch or jwt is expired
      res.clearCookie("jwt"); // We need to do this otherwise it will be an infinite loop
      throw new AuthenticationError(e.message);
    }
  }

  return {
    userId,
    setCookie: setCookie(res),
    clearCookie: clearCookie(res),
  };
};
