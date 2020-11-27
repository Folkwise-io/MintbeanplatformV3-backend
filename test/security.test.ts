import { ApolloErrorCodeEnum } from "./src/constants/errors";
import {
  FIVE_LEVEL_NESTED_QUERY,
  LOGIN_PASSWORDHASH,
  PROJECT_NESTED_EMAIL_QUERY,
  PROJECT_NESTED_PASSWORDHASH_QUERY,
  USER_EMAIL_QUERY,
  USER_PASSWORDHASH_QUERY,
} from "./src/constants/securityConstants";
import TestManager from "./src/TestManager";

const testManager = TestManager.build();

describe("Backend security", () => {
  it("rejects queries that are too nested", async () => {
    await testManager
      .getErrorCode({ query: FIVE_LEVEL_NESTED_QUERY })
      .then((errorMessage) => expect(errorMessage).toBe(ApolloErrorCodeEnum.GraphqlValidationFailed));
  });

  it("rejects public user query that asks for passwordHash", async () => {
    await testManager
      .getErrorCode({ query: USER_PASSWORDHASH_QUERY })
      .then((errorMessage) => expect(errorMessage).toBe(ApolloErrorCodeEnum.GraphqlValidationFailed));
  });

  it("rejects public nested project>user query that asks for passwordHash", async () => {
    await testManager
      .getErrorCode({ query: PROJECT_NESTED_PASSWORDHASH_QUERY })
      .then((errorMessage) => expect(errorMessage).toBe(ApolloErrorCodeEnum.GraphqlValidationFailed));
  });

  it("rejects public user query that asks for email", async () => {
    await testManager
      .getErrorCode({ query: USER_EMAIL_QUERY })
      .then((errorMessage) => expect(errorMessage).toBe(ApolloErrorCodeEnum.GraphqlValidationFailed));
  });

  it("rejects public user query that asks for email", async () => {
    await testManager
      .getErrorCode({ query: PROJECT_NESTED_EMAIL_QUERY })
      .then((errorMessage) => expect(errorMessage).toBe(ApolloErrorCodeEnum.GraphqlValidationFailed));
  });

  it("rejects private login mutation that asks for passwordHash", async () => {
    await testManager
      .getErrorCode({ query: LOGIN_PASSWORDHASH })
      .then((errorMessage) => expect(errorMessage).toBe(ApolloErrorCodeEnum.GraphqlValidationFailed));
  });
});
