import moment, { Moment } from "moment-timezone";
import { Meet } from "../types/gqlGeneratedTypes";
import { EventAttributes } from "ics";
import * as ics from "ics";
import { Attachment } from "../types/ScheduledEmail";
import { User } from "../types/User";

/** Options for meet calendar invite. If duration not specified, invite will span entire time from meet startTime to endTime */
interface MeetIcsOptions {
  duration?: ics.DurationObject | null;
  customTitle?: string | null;
  customDescription?: string | null;
}

export const generateMeetUrl = (id: string) => `https://mintbean.io/meets/${id}`;

/** Builds an ics calendar attachment based on meet details. The invite's start/end time defaults to the meet's startTime/endTime, so specify duration in options if desired otherwise  */
export const generateMeetIcsAttachments = (meet: Meet, options: MeetIcsOptions = {}): Attachment[] => {
  const icsEventAttribute = mapMeetToIcsEventAttributes(meet, options);
  const icsFile = generateIcsFileInBase64(icsEventAttribute);
  return [
    {
      content: icsFile,
      filename: "invite.ics",
      type: "application/calendar",
      disposition: "attachment",
    },
  ];
};

const momentToDateArray = (moment: Moment): ics.DateArray => {
  return [moment.year(), moment.month() + 1, moment.date(), moment.hours(), moment.minutes()];
};

export const mapMeetToIcsEventAttributes = (meet: Meet, options: MeetIcsOptions = {}): EventAttributes => {
  const { title, description, region, id, startTime, endTime, registerLink } = meet;
  const { duration, customTitle, customDescription } = options;

  const resolvedTitle = customTitle ? customTitle : title;
  const resolvedDescription = customDescription ? customDescription : description;

  const momentStartTimeUTC = moment.tz(startTime, region).utc();

  const start: ics.DateArray = momentToDateArray(momentStartTimeUTC);

  // shared by both invite types: with specifed duration OR end time
  const commonAttributes: Partial<EventAttributes> = {
    startInputType: "utc",
    startOutputType: "utc",
    endInputType: "utc",
    endOutputType: "utc",
    start,
    title: resolvedTitle,
    description: resolvedDescription,
    location: registerLink || generateMeetUrl(id), // link as location makes it easier for user to find
    url: registerLink || generateMeetUrl(id),
    status: "CONFIRMED",
    organizer: { name: "Mintbean", email: "info@mintbean.io" },
  };

  // Ics invites can have a specified duration OR end time
  if (duration) {
    const icsWithDuration = <EventAttributes>{
      ...commonAttributes,
      duration,
    };

    return icsWithDuration;
  } else {
    const momentEndTimeUTC = moment.tz(endTime, region).utc();
    const end: ics.DateArray = momentToDateArray(momentEndTimeUTC);

    const icsWithEnd = <EventAttributes>{
      ...commonAttributes,
      end,
    };
    return icsWithEnd;
  }
};

export const generateIcsFileInBase64 = (icsEventAttribute: EventAttributes): string => {
  const icsFile = ics.createEvent(icsEventAttribute).value;
  const icsFileBuffered = Buffer.from(icsFile as string);
  const icsFileBase64 = (icsFileBuffered as Buffer).toString("base64");
  return icsFileBase64;
};

// TODO: Keeping below as reference for adding JSONLD in future. Remove later as it this function is part of old email system.

// export const generateJsonLdHtml = (user: User, meet: Meet, registrationId: string): string => {
//   const { id, title, description, startTime, endTime, region, coverImageUrl, registerLink } = meet;
//   const { firstName, lastName } = user;
//   const startTimeIsoWithTimezone = moment.tz(startTime, region).format();
//   const endTimeIsoWithTimezone = moment.tz(endTime, region).format();
//   const startTimeHumanized = moment.tz(startTime, region).format("dddd, MMMM Do YYYY, h:mm:ss a z");
//   const endTimeHumanized = moment.tz(endTime, region).format("dddd, MMMM Do YYYY, h:mm:ss a z");

//   const meetUrl = generateMeetUrl(id);
//   const email = `
// <html>
//   <head>
//     <script type="application/ld+json">
//     {
//       "@context": "http://schema.org",
//       "@type": "EventReservation",
//       "reservationNumber": "${registrationId}",
//       "reservationStatus": "http://schema.org/Confirmed",
//       "underName": {
//         "@type": "Person",
//         "name": "${firstName} ${lastName}"
//       },
//       "reservationFor": {
//         "@type": "Event",
//         "name": "${title} - ${registerLink}",
//         "startDate": "${startTimeIsoWithTimezone}",
//         "endDate": "${endTimeIsoWithTimezone}",
//         "location": {
//           "@type": "Place",
//           "name": "Mintbean",
//           "address": {
//             "@type": "PostalAddress",
//             "addressLocality": "Toronto",
//             "addressRegion": "ON"
//           },
//           "url": "https://mintbean.io"
//         }
//       }
//     }
//     </script>
//   </head>
//   <body>
//     <p style='color:#4a5566;font-size:21px;line-height:28px;'>
//       Hi ${firstName} 👋 <br/>
//       <br/>
//       Thank you for registering for the <strong><a href='${meetUrl}'>${title}</a></strong>!<br/>
//       We are so excited for you to be joining us!<br/>
//       <br/>
//       <strong>Next Steps:</strong><br/>
//       1. <strong>Join our community on Discord!</strong> This is our main communication channel. Connect with other developers like yourself and get the latest on our upcoming workshops, dev hangouts, and hackathons here: https://discord.gg/Njgt5rZ<br/>
//       <br/>
//       2. <strong>Join us on Zoom</strong> at the start time of our hackathon for orientation and challenge release: ${registerLink} <br/>
//       <br/>
//       For any further questions or concerns, please reach out to us on Discord! See you on the flip side, minty bean! 😊
//     </p>
//     <br/>
//     <br/>
//     <br/>
//     <h2>Event Details:</h2>
//     <h1>${title}</h1>
//     <h2>${description}</h2>
//     <img src='${coverImageUrl}' width='600px' />
//     <h3>Start Time: ${startTimeHumanized}</h3>
//     <h3>End Time: ${endTimeHumanized}</h3>
//   </body>
// </html>
// `;
//   return email;
// };
