import { Email } from "../../types/Email";
import EmailService from "../../service/EmailService";
import { Meet, Resolvers } from "../../types/gqlGeneratedTypes";
import EmailResolverValidator from "../../validator/EmailResolverValidator";
import { ServerContext } from "../../buildServerContext";
import { ensureExists } from "../../util/ensureExists";
import { User } from "../../types/User";
import ensureAdmin from "../../util/ensureAdmin";
import MeetDao from "../../dao/MeetDao";

const emailResolver = (
  emailResolverValidator: EmailResolverValidator,
  emailService: EmailService,
  meetDao: MeetDao,
): Resolvers => {
  return {
    // Mutation: {
    //   //TODO: check yup validation of input in emailResolverValidator
    //   sendTestEmail: (_root, { input }, context: ServerContext): Promise<boolean> => {
    //     ensureAdmin(context);
    //     const { subject, body } = input;
    //     const testEmail: Email = {
    //       to: "jimmy.peng@mintbean.io",
    //       from: "jimmy.peng@mintbean.io",
    //       subject: subject,
    //       html: body,
    //     };
    //     return emailService.sendEmail(testEmail);
    //   },
    //   sendReminderEmailForMeet: async (_root, { input }, context: ServerContext) => {
    //     ensureAdmin(context);
    //     const { meetId, subject, body } = input;
    //     const meet = ensureExists<Meet>("Meet")(await meetDao.getOne({ id: meetId }));
    //     // TODO: get users and map over their emails and send them all
    //     const email = emailService.generateMeetReminderEmail("jimmy.peng@mintbean.io", meet);
    //     return emailService.sendEmail(email);
    //   },
    //   sendSampleRegistrationEmailForMeet: async (_root, args, context: ServerContext) => {
    //     ensureAdmin(context);
    //     const user: User = {
    //       id: "00000000-0000-0000-0000-000000000000",
    //       email: "jimmy.peng@mintbean.io",
    //       passwordHash: "$2a$10$FB/BOAVhpuLvpOREQVmvmezD4ED/.JBIDRh70tGevYzYzQgFId2u.",
    //       firstName: "Jimmy",
    //       lastName: "Peng",
    //       createdAt: "2019-10-15",
    //       updatedAt: "2019-10-15",
    //       isAdmin: false,
    //     };
    //     const meet = ensureExists<Meet>("Meet")(await meetDao.getOne({ id: args.meetId }));
    //     const email = emailService.generateMeetRegistrationEmail(user, meet, "REGISTRATION_UUID_WILL_GO_HERE");
    //     return emailService.sendEmail(email);
    //   },
    // },
  };
};

export default emailResolver;
