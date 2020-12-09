export interface EmailScheduleDaoSendInput {
  to: string;
  from: string;
  subject: string;
  html: string;
}

export default interface EmailScheduleDao {
  send(input: EmailScheduleDaoSendInput): Promise<void>;
}
