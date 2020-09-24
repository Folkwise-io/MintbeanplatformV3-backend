import { FIVE_LEVEL_NESTED_QUERY } from "./src/securityConstants";
import TestManager from "./src/TestManager";

const testManager = TestManager.build();

describe("Backend security", () => {
  it("rejects queries that are too nested", async () => {
    await testManager
      .getErrorMessage({ query: FIVE_LEVEL_NESTED_QUERY })
      .then((errorMessage) => expect(errorMessage).toMatch(/too complex/i));
  });
});
