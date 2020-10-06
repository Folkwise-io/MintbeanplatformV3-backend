import moment from "moment-timezone";
import { Meet } from "../types/gqlGeneratedTypes";
import { EventAttributes } from "ics";

export const mapMeetToIcsEventAttributes = (meet: Meet): EventAttributes => {
  const { title, description, region, id, startTime, endTime } = meet;
  const startTimeUTC: Date = new Date(moment.tz(startTime, region).utc().format());
  const endTimeUTC: Date = new Date(moment.tz(endTime, region).utc().format());

  const IcsEventAttributes: EventAttributes = {
    startInputType: "utc",
    startOutputType: "utc",
    endInputType: "utc",
    endOutputType: "utc",
    start: [
      startTimeUTC.getFullYear(),
      startTimeUTC.getMonth() + 1,
      startTimeUTC.getDate(),
      startTimeUTC.getHours(),
      startTimeUTC.getMinutes(),
    ],
    end: [
      endTimeUTC.getFullYear(),
      endTimeUTC.getMonth() + 1,
      endTimeUTC.getDate(),
      endTimeUTC.getHours(),
      endTimeUTC.getMinutes(),
    ],
    title,
    description,
    location: region,
    url: `https://mintbean.io/meets/${id}`,
    status: "CONFIRMED",
    organizer: { name: "Mintbean", email: "info@mintbean.io" },
  };

  return IcsEventAttributes;
};
