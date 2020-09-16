import TestManager from "./src/TestManager";

const testManager = TestManager.build();

beforeEach(async () => {
  await testManager.deleteAllMeets();
});

afterAll(async () => {
  await testManager.deleteAllMeets();
  await testManager.destroy();
});

describe("Querying meets", () => {
  it("does something", async () => {
    expect(1).toBe(1);
  });
});
