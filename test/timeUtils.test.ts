import { nDaysAndHoursFromTargetInUtcTime, wallclockToUtcDate } from "../src/util/timeUtils";

describe("nDaysAndHoursFromTargetInUtcTime", () => {
  it("defaults target date to now if no target date provided", () => {
    const now = new Date();
    expect(nDaysAndHoursFromTargetInUtcTime(1, 0) >= now.toISOString()).toBe(true);
    expect(nDaysAndHoursFromTargetInUtcTime(0, 1) >= now.toISOString()).toBe(true);
    expect(nDaysAndHoursFromTargetInUtcTime(0, -1) <= now.toISOString()).toBe(true);
    expect(nDaysAndHoursFromTargetInUtcTime(-1, 0) <= now.toISOString()).toBe(true);
  });
  it("allows half hour intervals", () => {
    const now = new Date();
    expect(nDaysAndHoursFromTargetInUtcTime(0, 0.5) >= now.toISOString()).toBe(true);
    expect(nDaysAndHoursFromTargetInUtcTime(0, -0.5) <= now.toISOString()).toBe(true);
  });
  it("accurrately calculates offset from target date", () => {
    const targetDate = new Date("2020-12-01T12:00Z");
    expect(nDaysAndHoursFromTargetInUtcTime(0, 0.5, targetDate)).toMatch("2020-12-01T12:30:00.000Z");
    expect(nDaysAndHoursFromTargetInUtcTime(0, -0.5, targetDate)).toMatch("2020-12-01T11:30:00.000Z");
    expect(nDaysAndHoursFromTargetInUtcTime(1, 0, targetDate)).toMatch("2020-12-02T12:00:00.000Z");
  });
  it("crosses month and day boundaries correctly", () => {
    const targetDate = new Date("2020-12-01T12:00Z");
    expect(nDaysAndHoursFromTargetInUtcTime(-1, 0, targetDate)).toMatch("2020-11-30T12:00:00.000Z");
    expect(nDaysAndHoursFromTargetInUtcTime(0, 12, targetDate)).toMatch("2020-12-02T00:00:00.000Z");
    expect(nDaysAndHoursFromTargetInUtcTime(0, 13, targetDate)).toMatch("2020-12-02T01:00:00.000Z");
  });
});

describe("wallclockToUtcDate", () => {
  it("returns utc Date object based of wallclock time and region", () => {
    // 2020-12-03T15:00 Los Angeles should be 2020-12-03T23:00 UTC  (LA is -8hrs at that point in history)
    const wallclockTime = "2020-12-03T15:00";
    const region = "America/Los_Angeles";
    const expectedISO = "2020-12-03T23:00:00.000Z";
    expect(wallclockToUtcDate(wallclockTime, region).toISOString()).toMatch(expectedISO);
  });
});
