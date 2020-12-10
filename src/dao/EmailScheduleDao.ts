export interface EmailScheduleDaoSendInput {
  recipientUserId: string;
  meetId: string; // required for now until nullable use case arises.
}

export default interface EmailScheduleDao {
  queue(input: EmailScheduleDaoSendInput): Promise<void>;
}
