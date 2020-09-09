import { PersistenceContext } from "../../src/buildContext";
import { TestUserDao } from "./dao/TestUserDao";
import { TestState } from "./dao/TestState";

export const buildTestPersistenceContext = (state: TestState): PersistenceContext => {
  const userDao = new TestUserDao(state);

  return {
    userDao,
  };
};
