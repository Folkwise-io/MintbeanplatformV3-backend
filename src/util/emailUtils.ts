import moment from "moment-timezone";
import { Meet } from "../types/gqlGeneratedTypes";
import { EventAttributes } from "ics";
import * as ics from "ics";
import { Attachment } from "../types/Email";
import { User } from "../types/User";
const DISCORD_URL = "https://discord.gg/j7CjBAz";

const generateMeetUrl = (id: string) => `https://mintbean.io/meets/${id}`;

export const generateIcsAttachments = (meet: Meet): Attachment[] => {
  const icsEventAttribute = mapMeetToIcsEventAttributes(meet);
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

export const mapMeetToIcsEventAttributes = (meet: Meet): EventAttributes => {
  const { title, description, region, id, startTime, endTime, registerLink } = meet;
  const startTimeUTC = moment.tz(startTime, region).utc();
  const endTimeUTC = moment.tz(endTime, region).utc();

  const IcsEventAttributes: EventAttributes = {
    startInputType: "utc",
    startOutputType: "utc",
    endInputType: "utc",
    endOutputType: "utc",
    start: [
      startTimeUTC.year(),
      startTimeUTC.month() + 1,
      startTimeUTC.date(),
      startTimeUTC.hours(),
      startTimeUTC.minutes(),
    ],
    end: [endTimeUTC.year(), endTimeUTC.month() + 1, endTimeUTC.date(), endTimeUTC.hours(), endTimeUTC.minutes()],
    title,
    description,
    location: region,
    url: registerLink || generateMeetUrl(id),
    status: "CONFIRMED",
    organizer: { name: "Mintbean", email: "info@mintbean.io" },
  };

  return IcsEventAttributes;
};

export const generateIcsFileInBase64 = (icsEventAttribute: EventAttributes): string => {
  const icsFile = ics.createEvent(icsEventAttribute).value;
  const icsFileBuffered = Buffer.from(icsFile as string);
  const icsFileBase64 = (icsFileBuffered as Buffer).toString("base64");
  return icsFileBase64;
};

export const generateJsonLdHtml = (user: User, meet: Meet, registrationId: string): string => {
  const { id, title, description, startTime, endTime, region, coverImageUrl, registerLink } = meet;
  const { firstName, lastName } = user;
  const startTimeIsoWithTimezone = moment.tz(startTime, region).format();
  const endTimeIsoWithTimezone = moment.tz(endTime, region).format();
  const startTimeHumanized = moment.tz(startTime, region).format("dddd, MMMM Do YYYY, h:mm:ss a z");
  const endTimeHumanized = moment.tz(endTime, region).format("dddd, MMMM Do YYYY, h:mm:ss a z");

  const meetUrl = generateMeetUrl(id);
  const email = `
<html>
  <head>
    <script type="application/ld+json">
    {
      "@context": "http://schema.org",
      "@type": "EventReservation",
      "reservationNumber": "${registrationId}",
      "reservationStatus": "http://schema.org/Confirmed",
      "underName": {
        "@type": "Person",
        "name": "${firstName} ${lastName}"
      },
      "reservationFor": {
        "@type": "Event",
        "name": "${title} - ${registerLink}",
        "startDate": "${startTimeIsoWithTimezone}",
        "endDate": "${endTimeIsoWithTimezone}",
        "location": {
          "@type": "Place",
          "name": "Mintbean",
          "address": {
            "@type": "PostalAddress",
            "addressLocality": "Toronto",
            "addressRegion": "ON"
          },
          "url": "https://mintbean.io"
        }
      }
    }
    </script>
  </head>
  <body>
    <p style='color:#4a5566;font-size:21px;line-height:28px;'>
      Hi ${firstName} 👋 <br/>
      <br/>
      Thank you for registering for the <strong><a href='${meetUrl}'>${title}</a></strong>!<br/>
      We are so excited for you to be joining us!<br/>
      <br/>
      <strong>Next Steps:</strong><br/>
      1. <strong>Join our community on Discord!</strong> This is our main communication channel. Connect with other developers like yourself and get the latest on our upcoming workshops, dev hangouts, and hackathons here: https://discord.gg/Njgt5rZ<br/>
      <br/>
      2. <strong>Join us on Zoom</strong> at the start time of our hackathon for orientation and challenge release: ${meetUrl} <br/>
      <br/>
      For any further questions or concerns, please reach out to us on Discord! See you on the flip side, minty bean! 😊
    </p>
    <br/>
    <br/>
    <br/>
    <h2>Event Details:</h2>
    <h1>${title}</h1>
    <h2>${description}</h2>
    <img src='${coverImageUrl}' width='600px' />
    <h3>Start Time: ${startTimeHumanized}</h3>
    <h3>End Time: ${endTimeHumanized}</h3>
  </body>
</html>
`;
  return email;
};
