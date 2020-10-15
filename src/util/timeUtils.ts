import { Meet, RegisterLinkStatus } from "../types/gqlGeneratedTypes";
import moment from "moment-timezone";
const MILLISECONDS_IN_ONE_HOUR = 60 * 60 * 1000;
const MILLISECONDS_IN_ONE_DAY = 24 * MILLISECONDS_IN_ONE_HOUR;

export const nDaysAndHoursFromNowInWallClockTime = (days: number, hour: number = 0): string => {
  const now = new Date();
  now.setDate(now.getDate() + days);
  now.setUTCHours(now.getHours() + hour);
  const timestamp = now.toISOString().replace(/Z$/, "");
  return timestamp;
};

export const nDaysAndHoursFromNowInUtcTime = (days: number, hours: number = 0): string => {
  const now = new Date();
  const newTime = new Date();
  const totalMillisecondsOffset = days * MILLISECONDS_IN_ONE_DAY + hours * MILLISECONDS_IN_ONE_HOUR;
  newTime.setTime(now.getTime() + totalMillisecondsOffset);

  return newTime.toISOString();
};

export const calculateMeetRegisterLinkStatus = (meet: Meet): RegisterLinkStatus => {
  const { endTime, startTime, region } = meet;

  const startUtc = moment.tz(startTime, region);
  const endUtc = moment.tz(endTime, region);
  const nowUtc = moment.tz();

  const eventStarted = nowUtc.isAfter(startUtc);
  const eventEnded = nowUtc.isAfter(endUtc);

  if (eventStarted) {
    if (eventEnded) {
      return RegisterLinkStatus.Closed;
    } else {
      return RegisterLinkStatus.Open;
    }
  } else {
    return RegisterLinkStatus.Waiting;
  }
};
