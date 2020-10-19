import { ALGOLIA } from "./src/meetConstants";
import { AMY_ALGOLIA_SCHEDULED_EMAIL } from "./src/scheduledEmailConstants";
import TestManager from "./src/TestManager";
import { AMY } from "./src/userConstants";

const testManager = TestManager.build();

beforeAll(async () => {
  await testManager.deleteAllUsers();
  await testManager.deleteAllMeets();
  await testManager.addUsers([AMY]);
  await testManager.addMeets([ALGOLIA]);
});

afterEach(async () => {
  await testManager.deleteAllEmails();
});

afterAll(async () => {
  await testManager.deleteAllMeets();
  await testManager.deleteAllUsers();
  await testManager.destroy();
});

describe("EmailDao's handling of scheduled emails", () => {
  it("can queue an email", async () => {
    await testManager.queue([AMY_ALGOLIA_SCHEDULED_EMAIL]);
  });
});
