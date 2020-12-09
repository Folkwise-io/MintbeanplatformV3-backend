import MeetDao from "../../dao/MeetDao";
import UserDao from "../../dao/UserDao";
import { EmailTemplateName, Attachment } from "../../types/Email";
import { Meet } from "../../types/gqlGeneratedTypes";
import { User } from "../../types/User";
import { generateMeetIcsAttachments } from "../../util/emailUtils";

/** All inflatable variable inputs to build EmailContext */
interface InflatableVars {
  recipientId: string;
  meetId?: string | null;
}

/** Email context should contain all inflated variables in scheduledEmails that may be used in templating interpolation */
export interface EmailContext {
  recipient: User;
  meet?: Meet;
  emailAttachments?: Attachment[];
}

export default class EmailContextBuilder {
  constructor(private userDao: UserDao, private meetDao: MeetDao) {}

  // Maybe this doesn't belong in EmailCommander but couldn't find another place for it as it relies on Dao context
  async buildContext(templateName: EmailTemplateName, inflatableVars: InflatableVars): Promise<EmailContext> {
    const { recipientId, meetId } = inflatableVars;
    const { HACKATHON_REGISTRATION_CONFIRM, WORKSHOP_REGISTRATION_CONFIRM } = EmailTemplateName;

    // if error on fetching recipient, the email cannot be sent, so allow error to be thrown to be handled when context being built
    const recipient = (await this.userDao.getOne({ id: recipientId })) as User;

    // Below we are fetching optional variables, gracefully fail with log if entity not found.
    let meet = undefined;
    let emailAttachments: Attachment[] | undefined;

    if (meetId) {
      try {
        meet = await this.meetDao.getOne({ id: meetId });
      } catch (e) {
        console.log(e);
      }
    }
    // Build calendar invite attachments for appropriate templates
    if (meet) {
      if (templateName === HACKATHON_REGISTRATION_CONFIRM) {
        // Hackathon kickoff invites are duration 60mins from startTime
        emailAttachments = generateMeetIcsAttachments(meet, {
          duration: { minutes: 60 },
          title: `Kickoff for Mintbean Hackathon "${meet.title}"`,
        });
      } else if ((templateName = WORKSHOP_REGISTRATION_CONFIRM)) {
        emailAttachments = generateMeetIcsAttachments(meet, {
          title: `[Mintbean] "${meet.title}"`,
        });
      }
    }

    return {
      recipient,
      meet,
      emailAttachments,
    };
  }
}
