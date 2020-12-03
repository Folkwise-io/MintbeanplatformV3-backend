import { EmailTemplateName, ScheduledEmail } from "../src/types/Email";
import { ALGOLIA, DELETE_MEET } from "./src/constants/meetConstants";

import {
  ALGOLIA_3,
  AMY_ANIMATION_TOYS_2_REGISTRATION,
  ANIMATION_TOYS_2,
  GET_MY_REGISTERED_MEETS_QUERY,
  GET_REGISTRANTS_FOR_MEET_QUERY,
  GET_USER_REGISTERED_MEETS_QUERY,
  REGISTER_FOR_MEET_QUERY,
} from "./src/constants/meetRegistrationConstants";
import TestManager from "./src/TestManager";
import { AMY, BOB } from "./src/constants/userConstants";
import { getBobCookies, getAdminCookies } from "./src/util";
import { ApolloErrorCodeEnum } from "./src/constants/errors";

const testManager = TestManager.build();
const { emailDao } = testManager.params.persistenceContext;
let bobCookies: string[];
let adminCookies: string[];

beforeAll(async () => {
  await testManager.deleteAllUsers();
  await testManager.deleteAllMeets();
  bobCookies = await getBobCookies();
  adminCookies = await getAdminCookies();
  await testManager.addUsers([AMY, BOB]);
  await testManager.addMeets([ANIMATION_TOYS_2, ALGOLIA_3]);
});

beforeEach(async () => {
  await testManager.deleteAllMeetRegistrations();
  await testManager.deleteAllEmails();
});

afterAll(async () => {
  await testManager.deleteAllMeetRegistrations();
  await testManager.deleteAllMeets();
  await testManager.deleteAllUsers();
  await testManager.destroy();
});

describe("Querying to find registrants of meets", () => {
  it("returns a list of meets that a user has registered for", async () => {
    await testManager.addMeetRegistrations([AMY_ANIMATION_TOYS_2_REGISTRATION]);
    await testManager
      .getGraphQLData({ query: GET_USER_REGISTERED_MEETS_QUERY, variables: { id: AMY.id } })
      .then(({ user }) => {
        expect(ANIMATION_TOYS_2).toMatchObject(user.registeredMeets[0]);
      });
  });

  it("returns a list of meets that the current has registered form using cookies", async () => {
    await testManager.addMeetRegistrations([AMY_ANIMATION_TOYS_2_REGISTRATION]);
    await testManager.getGraphQLData({ query: GET_MY_REGISTERED_MEETS_QUERY, cookies: adminCookies }).then(({ me }) => {
      expect(ANIMATION_TOYS_2).toMatchObject(me.registeredMeets[0]);
    });
  });

  it("returns a list of registrants that a meet has", async () => {
    await testManager.addMeetRegistrations([AMY_ANIMATION_TOYS_2_REGISTRATION]);
    await testManager
      .getGraphQLData({ query: GET_REGISTRANTS_FOR_MEET_QUERY, variables: { id: ANIMATION_TOYS_2.id } })
      .then(({ meet }) => {
        expect(AMY).toMatchObject(meet.registrants[0]);
      });
  });
});

describe("Registering for a meet", () => {
  it("lets a logged in user register for a meet and then the meet shows up in registeredMeets query", async () => {
    await testManager
      .getGraphQLData({
        query: REGISTER_FOR_MEET_QUERY,
        variables: { meetId: ANIMATION_TOYS_2.id },
        cookies: adminCookies,
      })
      .then(({ registerForMeet }) => expect(registerForMeet).toBe(true));

    // Check for registeredMeets in me query
    await testManager.getGraphQLData({ query: GET_MY_REGISTERED_MEETS_QUERY, cookies: adminCookies }).then(({ me }) => {
      expect(ANIMATION_TOYS_2).toMatchObject(me.registeredMeets[0]);
    });

    // Check for registeredMeets in user query
    await testManager
      .getGraphQLData({ query: GET_USER_REGISTERED_MEETS_QUERY, variables: { id: AMY.id } })
      .then(({ user }) => {
        expect(ANIMATION_TOYS_2).toMatchObject(user.registeredMeets[0]);
      });

    // Check for registrants in meet query
    await testManager
      .getGraphQLData({ query: GET_REGISTRANTS_FOR_MEET_QUERY, variables: { id: ANIMATION_TOYS_2.id } })
      .then(({ meet }) => {
        expect(AMY).toMatchObject(meet.registrants[0]);
      });
  });

  it("returns an error message if trying to register without being logged in", async () => {
    await testManager
      .getErrorCode({
        query: REGISTER_FOR_MEET_QUERY,
        variables: { meetId: ANIMATION_TOYS_2.id },
        cookies: undefined,
      })
      .then((errorCode) => expect(errorCode).toBe(ApolloErrorCodeEnum.Unauthenticated));
  });

  it("returns an error message if trying to register for non-existent meet", async () => {
    await testManager
      .getErrorCode({ query: REGISTER_FOR_MEET_QUERY, variables: { meetId: ALGOLIA.id }, cookies: adminCookies })
      .then((errroCode) => expect(errroCode).toMatch(ApolloErrorCodeEnum.InternalServerError));
  });
});

describe("Email queue after registering for a meet", () => {
  it("lets a logged in user register for a hackathon meet and then 3 emails get queued including one for immediate sending", async () => {
    await testManager.getGraphQLData({
      query: REGISTER_FOR_MEET_QUERY,
      variables: { meetId: ANIMATION_TOYS_2.id },
      cookies: adminCookies,
    });

    // Check that 3 emails are queued in the db : confirm (immediate), reminder 1 (T-24hr), reminder 2 (T-30min)
    await emailDao.getOverdueScheduledEmails().then((scheduledEmails: ScheduledEmail[]) => {
      expect(scheduledEmails).toHaveLength(3); //
      const confirm = scheduledEmails[0];
      const reminder1 = scheduledEmails[1];
      const reminder2 = scheduledEmails[2];

      expect(confirm).toMatchObject({
        templateName: EmailTemplateName.HACKATHON_REGISTRATION_CONFIRM,
        userId: AMY.id,
        meetId: ANIMATION_TOYS_2.id,
      });
      expect(new Date(confirm.sendAt) <= new Date()).toBe(true);

      expect(reminder1).toMatchObject({
        templateName: EmailTemplateName.HACKATHON_REGISTRATION_REMINDER_1,
        userId: AMY.id,
        meetId: ANIMATION_TOYS_2.id,
      });
      expect(reminder2).toMatchObject({
        templateName: EmailTemplateName.HACKATHON_REGISTRATION_REMINDER_2,
        userId: AMY.id,
        meetId: ANIMATION_TOYS_2.id,
      });
    });
    // TODO: test the same for workshop meet

    // it("lets a logged in user register for a hackathon meet and then 3 emails get queued including one for immediate sending", async () => {
    //   await testManager.getGraphQLData({
    //     query: REGISTER_FOR_MEET_QUERY,
    //     variables: { meetId: ANIMATION_TOYS_2.id },
    //     cookies: adminCookies,
    //   });

    //   // Check that 3 emails are queued in the db : confirm (immediate), reminder 1 (T-24hr), reminder 2 (T-30min)
    //   await emailDao.getOverdueScheduledEmails().then((scheduledEmails: ScheduledEmail[]) => {
    //     expect(scheduledEmails).toHaveLength(3); //
    //     const confirm = scheduledEmails[0];
    //     const reminder1 = scheduledEmails[1];
    //     const reminder2 = scheduledEmails[2];

    //     expect(confirm).toMatchObject({
    //       templateName: EmailTemplateName.HACKATHON_REGISTRATION_CONFIRM,
    //       userId: AMY.id,
    //       meetId: ANIMATION_TOYS_2.id,
    //     });
    //     expect(new Date(confirm.sendAt) <= new Date()).toBe(true);

    //     expect(reminder1).toMatchObject({
    //       templateName: EmailTemplateName.HACKATHON_REGISTRATION_REMINDER_1,
    //       userId: AMY.id,
    //       meetId: ANIMATION_TOYS_2.id,
    //     });
    //     expect(reminder2).toMatchObject({
    //       templateName: EmailTemplateName.HACKATHON_REGISTRATION_REMINDER_2,
    //       userId: AMY.id,
    //       meetId: ANIMATION_TOYS_2.id,
    //     });
    //   });
  });

  it("doesn't find the scheduled email if admin deletes meet after the user registers", async () => {
    await testManager.getGraphQLData({
      query: REGISTER_FOR_MEET_QUERY,
      variables: { meetId: ANIMATION_TOYS_2.id },
      cookies: adminCookies,
    });

    await testManager.getGraphQLData({
      query: DELETE_MEET,
      variables: { id: ANIMATION_TOYS_2.id },
      cookies: adminCookies,
    });

    await emailDao.getOverdueScheduledEmails().then((scheduledEmails: ScheduledEmail[]) => {
      expect(scheduledEmails).toHaveLength(0);
    });
  });
});
