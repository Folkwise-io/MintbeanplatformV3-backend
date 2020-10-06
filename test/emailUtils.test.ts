import { Meet } from "../src/types/gqlGeneratedTypes";
import { mapMeetToIcsEventAttributes } from "../src/util/emailUtils";

const PAPERJS: Meet = {
  id: "00000000-0000-0000-0000-000000000000",
  meetType: "hackMeet",
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
    const { title, description, url } = paperJsIcsEvent;
    expect(PAPERJS).toMatchObject({ title, description });
    expect(url).toBe(`https://mintbean.io/meets/${PAPERJS.id}`);
  });

  it("maps the time in UTC correctly", () => {
    const paperJsIcsEvent = mapMeetToIcsEventAttributes(PAPERJS);
    const meetStartTimeHour = new Date(PAPERJS.startTime).getHours();
    const icsStartTimeHour = paperJsIcsEvent.start[3] as number;
    expect(meetStartTimeHour - icsStartTimeHour).toBe(-4 || -5); // Toronto is -4 or -5
  });
});
