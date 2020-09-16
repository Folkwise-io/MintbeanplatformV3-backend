import Knex from "knex";
import knexConfig from "./db/knexfile";
import UserService from "./service/UserService";
import UserDaoKnex from "./dao/UserDaoKnex";
import UserResolverValidator from "./validator/UserResolverValidator";
import UserDao from "./dao/UserDao";
import MeetDaoKnex from "./dao/MeetDaoKnex";
import MeetDao from "./dao/MeetDao";

export interface PersistenceContext {
  userDao: UserDao;
  meetDao: MeetDao;
}

export function buildPersistenceContext(): PersistenceContext {
  const knex = Knex(knexConfig);
  const userDao = new UserDaoKnex(knex);
  const meetDao = new MeetDaoKnex(knex);

  return {
    userDao,
    meetDao,
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
