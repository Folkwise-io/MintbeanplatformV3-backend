import { Meet, MeetType } from "../src/types/gqlGeneratedTypes";
import { mapMeetToIcsEventAttributes, generateIcsFileInBase64, generateMeetUrl } from "../src/util/emailUtils";

const PAPERJS: Meet = {
  id: "00000000-0000-0000-0000-000000000000",
  meetType: MeetType.Hackathon,
  title: "Animation Toys",
  description: "Building impressive portfolio projects with PaperJS.",
  instructions: "See https://sites.google.com/mintbean.io/2020-06-01-animation-toys/home",
  registerLink: "http://eventbrite.com",
  coverImageUrl: "https://www.grafik.com.au/wp-content/uploads/2019/06/think-design.png",
  startTime: "2020-09-30T13:00:00.000",
  endTime: "2020-09-30T17:00:00.000",
  createdAt: "2020-08-15T12:00:00.000Z",
  updatedAt: "2020-08-15T12:00:00.000Z",
  region: "America/Toronto",
};

describe("Mapping a Meet object to ICS event attributes", () => {
  it("maps the Meet correctly", () => {
    const paperJsIcsEvent = mapMeetToIcsEventAttributes(PAPERJS);
    const { title, description, url, location, duration } = paperJsIcsEvent;
    console.log({ paperJsIcsEvent });
    expect(PAPERJS).toMatchObject({ description });
    expect(title).toMatch(PAPERJS.title);
    expect(url).toBe(PAPERJS.registerLink);
    expect(location).toBe(PAPERJS.registerLink || generateMeetUrl(PAPERJS.id));
    // expect(typeof duration).toMatch("number");
    expect(durationMins > 0).toBe(true);
  });

  it("maps the time in UTC correctly", () => {
    const paperJsIcsEvent = mapMeetToIcsEventAttributes(PAPERJS);
    const meetStartTimeHour = new Date(PAPERJS.startTime).getHours();
    const icsStartTimeHour = paperJsIcsEvent.start[3] as number;
    expect(meetStartTimeHour - icsStartTimeHour).toBe(-4 || -5); // Toronto is -4 or -5
  });
});

describe("Generating an ICS file in base 64", () => {
  it("generates the file successfully", () => {
    const paperJsIcsEvent = mapMeetToIcsEventAttributes(PAPERJS);
    const icsFileInBase64 = generateIcsFileInBase64(paperJsIcsEvent);
    expect(typeof icsFileInBase64).toBe("string");
  });
});
