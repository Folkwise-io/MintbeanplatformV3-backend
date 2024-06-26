import { Meet, RegisterLinkStatus } from "../types/gqlGeneratedTypes";
import moment from "moment-timezone";
import { string } from "yup";

const MILLISECONDS_IN_ONE_MINUTE = 60 * 1000;
const MILLISECONDS_IN_ONE_HOUR = 60 * MILLISECONDS_IN_ONE_MINUTE;
const MILLISECONDS_IN_ONE_DAY = 24 * MILLISECONDS_IN_ONE_HOUR;

//** takes target wallclock time and IANA region and returns a UTC ISO string of the offset time */
interface OffsetTimeUTCArgs {
  targetWallclock: string;
  targetRegion: string;
  offset?: {
    minutes?: number;
    hours?: number;
    days?: number;
  };
}
/** Converts wallclock/region to UTC ISO string. Pass optional offset option to add/subtract time from target  */
export const getISOString = ({ targetWallclock, targetRegion, offset = {} }: OffsetTimeUTCArgs): string => {
  const days = offset.days || 0;
  const hours = offset.hours || 0;
  const minutes = offset.minutes || 0;

  const targetDate = moment.tz(targetWallclock, targetRegion).utc().toDate();

  const hasOffsetOption = Object.keys(offset).length > 0;

  if (hasOffsetOption) {
    let offsetDate: Date;
    try {
      offsetDate = moment.tz(targetWallclock, targetRegion).utc().toDate(); // must make a copy of target to mutate time later
    } catch (e) {
      // in case bad date string inputs were given
      throw new Error("Problem calculating offset time, probably bad wallclocktime or region strings passed." + e);
    }

    const totalMillisecondsOffset =
      days * MILLISECONDS_IN_ONE_DAY + hours * MILLISECONDS_IN_ONE_HOUR + minutes * MILLISECONDS_IN_ONE_MINUTE;

    offsetDate.setTime(targetDate.getTime() + totalMillisecondsOffset);

    return offsetDate.toISOString();
  } else {
    return targetDate.toISOString();
  }
};

export const msDifference = (startTime: string, endTime: string, region: string): number => {
  const start = moment.tz(startTime, region).utc().toDate().getTime();
  const end = moment.tz(endTime, region).utc().toDate().getTime();
  return end - start;
};

export const nDaysAndHoursFromNowInWallClockTime = (days: number, hour: number = 0): string => {
  const now = new Date();
  now.setDate(now.getDate() + days);
  now.setUTCHours(now.getHours() + hour);
  const timestamp = now.toISOString().replace(/Z$/, "");
  return timestamp;
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
