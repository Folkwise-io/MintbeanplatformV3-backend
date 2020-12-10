import MeetDao from "../../dao/MeetDao";
import UserDao from "../../dao/UserDao";
import { Meet } from "../../types/gqlGeneratedTypes";
import { User } from "../../types/User";

// TOOD: DELETE THIS FILE

//** Inflated vars used to build emails. 'recipient' property will always be required such that recipient email address is known */
export interface EmailContext {
  recipient: User;
  meet?: Meet;
}

//** Aligns with inflatable vars from scheduledEmails data for now */
export interface BuildEmailContextInput {
  recipientId: string;
  meetId: string; // this will be nullable in future
}

//** "Inflation central" */
export class EmailContextBuilder {
  constructor(private userDao: UserDao, private meetDao: MeetDao) {}

  // Entity fetching should gracefully fail, except for recipient which is always required
  async buildEmailContext({ recipientId, meetId }: BuildEmailContextInput): Promise<EmailContext> {
    const recipient = await this.userDao.getOne({ id: recipientId });
    // How to do better error handling here?
    if (!recipient) throw new Error(`No recipient found for id: ${recipient}`);

    let meet: Meet | undefined;
    try {
      meet = await this.meetDao.getOne({ id: meetId });
    } catch (e) {
      console.log("Problem fetching meet when building email context: ", e);
    }
    return { recipient, meet };
  }
}
