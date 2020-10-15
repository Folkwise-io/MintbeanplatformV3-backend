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
  templateName: "meetRegistration" | "signup" | "checkInAfterSignup" | "all";
  userId?: string | null;
  meetId?: string | null;
  sendAt: string;
  sent: boolean;
  createdAt: string;
}
