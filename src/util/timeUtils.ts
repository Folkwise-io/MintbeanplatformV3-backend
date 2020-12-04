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

// Target time defaults to now
export const nDaysAndHoursFromTargetInUtcTime = (
  days: number,
  hours: number = 0,
  targetDate: Date = new Date(),
): string => {
  // clone target date
  const offsetDate = new Date(targetDate.getTime());
  const totalMillisecondsOffset = days * MILLISECONDS_IN_ONE_DAY + hours * MILLISECONDS_IN_ONE_HOUR;
  offsetDate.setTime(targetDate.getTime() + totalMillisecondsOffset);

  return offsetDate.toISOString();
};

export const wallclockToUtcDate = (wallclockTime: string, region: string): Date => {
  const m = moment.tz(wallclockTime, region);
  return new Date(m.year(), m.month(), m.date(), m.hours(), m.minutes());
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
