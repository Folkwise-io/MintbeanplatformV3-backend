import { PersistenceContext } from "../../../src/buildContext";
import { TestUserDao } from "./TestUserDao";
import { TestState } from "./TestState";

export const buildTestPersistenceContext = (state: TestState): PersistenceContext => {
  const userDao = new TestUserDao(state);

  return {
    userDao,
  };
};
