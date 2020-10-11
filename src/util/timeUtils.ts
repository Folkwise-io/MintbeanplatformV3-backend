import { Meet, RegisterLinkStatus } from "../types/gqlGeneratedTypes";
import moment from "moment";

export const nDaysFromNowInWallClockTime = (days: number, hour: number = 0): string => {
  const now = new Date();
  now.setDate(now.getDate() + days);
  now.setHours(hour);
  now.setMinutes(0);
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
