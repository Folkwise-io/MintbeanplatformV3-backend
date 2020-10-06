import moment from "moment-timezone";
import { Meet } from "../types/gqlGeneratedTypes";
import { EventAttributes } from "ics";
import * as ics from "ics";

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
