import { ScheduledEmail } from "../src/types/Email";
import { ALGOLIA } from "./src/meetConstants";
import { AMY_ALGOLIA_SCHEDULED_EMAIL } from "./src/scheduledEmailConstants";
import TestManager from "./src/TestManager";
import { AMY } from "./src/userConstants";

const testManager = TestManager.build();
const { emailDao } = testManager.params.persistenceContext;

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
  it("can queue an email that should be sent immediately and find it", async () => {
    await emailDao.queue([AMY_ALGOLIA_SCHEDULED_EMAIL]);

    await emailDao.getUnsentScheduledEmails().then((emails: ScheduledEmail[]) => expect(emails).toHaveLength(1));
    await emailDao.getOverdueScheduledEmails().then((emails: ScheduledEmail[]) => expect(emails).toHaveLength(1));
  });
});
