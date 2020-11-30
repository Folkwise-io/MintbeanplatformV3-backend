import { ScheduledEmail } from "../src/types/Email";
import { nDaysAndHoursFromNowInUtcTime } from "../src/util/timeUtils";
import { ALGOLIA } from "./src/constants/meetConstants";
import { AMY_ALGOLIA_SCHEDULED_EMAIL } from "./src/scheduledEmailConstants";
import TestManager from "./src/TestManager";
import { AMY } from "./src/constants/userConstants";

const testManager = TestManager.build();
const { emailDao } = testManager.params.persistenceContext;

beforeAll(async () => {
  await testManager.deleteAllUsers();
  await testManager.deleteAllMeets();
  await testManager.deleteAllEmails();
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

  it("can queue an email that should be sent in the future and find it", async () => {
    const SCHEDULED_EMAIL_WITH_DELAY = { ...AMY_ALGOLIA_SCHEDULED_EMAIL, sendAt: nDaysAndHoursFromNowInUtcTime(0, 1) };
    await emailDao.queue([SCHEDULED_EMAIL_WITH_DELAY]);

    await emailDao.getUnsentScheduledEmails().then((emails: ScheduledEmail[]) => expect(emails).toHaveLength(1));
    await emailDao.getOverdueScheduledEmails().then((emails: ScheduledEmail[]) => expect(emails).toHaveLength(0));
  });

  it("does not get emails that are already sent", async () => {
    const SCHEDULED_EMAIL_ALREADY_SENT = { ...AMY_ALGOLIA_SCHEDULED_EMAIL, sent: true };
    await emailDao.queue([SCHEDULED_EMAIL_ALREADY_SENT]);

    await emailDao.getUnsentScheduledEmails().then((emails: ScheduledEmail[]) => expect(emails).toHaveLength(0));
    await emailDao.getOverdueScheduledEmails().then((emails: ScheduledEmail[]) => expect(emails).toHaveLength(0));
  });
});
