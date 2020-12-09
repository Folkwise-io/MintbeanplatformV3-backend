export interface Email {
  to: string;
  from: string;
  subject: string;
  html: string;
  attachments?: Attachment[];
}

export interface Attachment {
  content: string;
  filename: string;
  type: string;
  disposition: string;
}

export interface ScheduledEmail {
  id: string;
  sendAt: string;
  sent: boolean;
  // TODO: properties below will change when scheduledEmails table structure changes
  to: string;
  from: string;
  subject: string;
  html: string;
}
