import moment from "moment-timezone";
import { Meet } from "../types/gqlGeneratedTypes";
import { EventAttributes } from "ics";
import * as ics from "ics";
import { Attachment, Email, EmailTemplateName } from "../types/Email";
import { EmailContext } from "../service/EmailService/EmailCommanderImpl";
import { templates } from "../service/EmailService/templates";
import config from "./config";

interface MeetIcsAttributesOverrides {
  duration?: ics.DurationObject;
  title?: string;
  description?: string;
  location?: string;
  url?: string;
  start?: never;
  end?: never;
}

const { senderEmail } = config;

const generateMeetUrl = (id: string) => `https://mintbean.io/meets/${id}`;

// durationMins is optional - use if you want to overwrite the default endTime.
// For example, hackathon meets themselves are up to a week long, but we only want a 60 min kickoff block put on the calendar
export const generateMeetIcsAttachments = (meet: Meet, overrides: MeetIcsAttributesOverrides = {}): Attachment[] => {
  const icsEventAttributes = mapMeetToIcsEventAttributes(meet, overrides);
  const icsFile = generateIcsFileInBase64(icsEventAttributes);
  return [
    {
      content: icsFile,
      filename: "invite.ics",
      type: "application/calendar",
      disposition: "attachment",
    },
  ];
};

export const mapMeetToIcsEventAttributes = (
  meet: Meet,
  overrides: MeetIcsAttributesOverrides = {},
): EventAttributes => {
  const { title, description, region, id, startTime, endTime, registerLink } = meet;
  const { duration } = overrides;
  const startTimeUTC = moment.tz(startTime, region).utc();
  const start: ics.DateArray = [
    startTimeUTC.year(),
    startTimeUTC.month() + 1,
    startTimeUTC.date(),
    startTimeUTC.hours(),
    startTimeUTC.minutes(),
  ];

  const commonAttributes: Partial<EventAttributes> = {
    startInputType: "utc",
    startOutputType: "utc",
    endInputType: "utc",
    endOutputType: "utc",
    title,
    description,
    location: region,
    url: registerLink || generateMeetUrl(id),
    status: "CONFIRMED",
    organizer: { name: "Mintbean", email: "info@mintbean.io" },
    ...overrides,
  };

  // Use meet's endtime for 'end' if no duration specified in overrides
  if (!duration) {
    const endTimeUTC = moment.tz(endTime, region).utc();
    const end: ics.DateArray = [
      endTimeUTC.year(),
      endTimeUTC.month() + 1,
      endTimeUTC.date(),
      endTimeUTC.hours(),
      endTimeUTC.minutes(),
    ];
    const IcsEventAttributesExplictEndTime: EventAttributes = {
      ...commonAttributes,
      start,
      end,
    };
    return IcsEventAttributesExplictEndTime;
  }
  // Explict duration was given, so use that instead of 'end'
  const IcsEventAttributesExplictDuration: EventAttributes = {
    ...commonAttributes,
    start,
    duration,
  };

  return IcsEventAttributesExplictDuration;
};

export const generateIcsFileInBase64 = (icsEventAttribute: EventAttributes): string => {
  const icsFile = ics.createEvent(icsEventAttribute).value;
  const icsFileBuffered = Buffer.from(icsFile as string);
  const icsFileBase64 = (icsFileBuffered as Buffer).toString("base64");
  return icsFileBase64;
};

export const generateEmail = (templateName: EmailTemplateName, context: EmailContext): Email => {
  if (!templates[templateName]) {
    throw new Error(`ILLEGAL STATE: Template name [${templateName}] not implemented.`);
  }
  const { recipient, emailAttachments } = context;
  const subject = templates[templateName].subject(context);
  const html = templates[templateName].html(context);
  const email = {
    to: recipient.email,
    from: senderEmail,
    subject,
    html,
    attachments: emailAttachments,
  };
  return email;
};
