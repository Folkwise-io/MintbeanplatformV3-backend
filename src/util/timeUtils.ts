export const nDaysFromNowInWallClockTime = (days: number, hour: number = 0): string => {
  const now = new Date();
  now.setDate(now.getDate() + days);
  now.setHours(hour);
  now.setMinutes(0);
  const timestamp = now.toISOString().replace(/Z$/, "");
  return timestamp;
};
