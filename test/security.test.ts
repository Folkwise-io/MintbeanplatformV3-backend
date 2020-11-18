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
      .getErrorMessage({ query: FIVE_LEVEL_NESTED_QUERY })
      .then((errorMessage) => expect(errorMessage).toMatch(/maximum.*depth/i));
  });

  it("rejects public user query that asks for passwordHash", async () => {
    await testManager
      .getErrorMessage({ query: USER_PASSWORDHASH_QUERY })
      .then((errorMessage) => expect(errorMessage).toMatch(/passwordHash/i));
  });

  it("rejects public nested project>user query that asks for passwordHash", async () => {
    await testManager
      .getErrorMessage({ query: PROJECT_NESTED_PASSWORDHASH_QUERY })
      .then((errorMessage) => expect(errorMessage).toMatch(/passwordHash/i));
  });

  it("rejects public user query that asks for email", async () => {
    await testManager
      .getErrorMessage({ query: USER_EMAIL_QUERY })
      .then((errorMessage) => expect(errorMessage).toMatch(/email/i));
  });

  it("rejects public user query that asks for email", async () => {
    await testManager
      .getErrorMessage({ query: PROJECT_NESTED_EMAIL_QUERY })
      .then((errorMessage) => expect(errorMessage).toMatch(/email/i));
  });

  it("rejects private login mutation that asks for passwordHash", async () => {
    await testManager
      .getErrorMessage({ query: LOGIN_PASSWORDHASH })
      .then((errorMessage) => expect(errorMessage).toMatch(/passwordHash/i));
  });
});
