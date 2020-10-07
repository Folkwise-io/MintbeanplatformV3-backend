import moment from "moment-timezone";
import { Meet } from "../types/gqlGeneratedTypes";
import { EventAttributes } from "ics";
import * as ics from "ics";
import { Attachment } from "../types/Email";
const DISCORD_URL = "https://discord.gg/j7CjBAz";

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
  const { title, description, region, id, startTime, endTime } = meet;
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
    url: `https://mintbean.io/meets/${id}`,
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

export const generateJsonLdHtmlFromMeet = (meet: Meet): string => {
  const { id, title, description, startTime, endTime, region, coverImageUrl } = meet;

  const startTimeUTC = moment.tz(startTime, region).format();
  const endTimeUTC = moment.tz(endTime, region).format();
  const meetUrl = `https://mintbean.io/meets/${id}`;
  const email = `
<html>
  <head>
    <script type="application/ld+json">
    {
      "@context": "http://schema.org",
      "@type": "EventReservation",
      "reservationNumber": "E123456789",
      "reservationStatus": "http://schema.org/Confirmed",
      "underName": {
        "@type": "Person",
        "name": "John Smith"
      },
      "reservationFor": {
        "@type": "Event",
        "name": "${title} - ${meetUrl}",
        "startDate": "${startTimeUTC}",
        "endDate": "${endTimeUTC}",
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
    <p style='color:#4a5566;font-size:21px;line-height:28px;'>Hi Amy 👋</p>
    <br/>
    <p style='color:#4a5566;font-size:21px;line-height:28px;'>
      Thank you for registering for the <strong><a href='${meetUrl}'>${title}</a></strong>! Please join our <a href='${DISCORD_URL}'>Discord</a> at the start time!
    </p>
    <br/>
    <p style='color:#4a5566;font-size:21px;line-height:28px;'>- Your friends at Mintbean</p>
    <br/>
    <br/>
    <em>Event Details:</em>
    <h1>${title}</h1>
    <h3>${description}</h3>
    <img src='${coverImageUrl}' width='600px' />
  </body>
</html>
`;
  return email;
};
