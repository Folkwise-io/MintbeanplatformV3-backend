import * as Knex from "knex";
import { nDaysAndHoursFromNowInWallClockTime } from "../../util/timeUtils";

export async function seed(knex: Knex): Promise<void> {
  await knex("meets").del();

  await knex("meets").insert([
    {
      id: "00000000-0000-0000-0000-000000000000",
      meetType: "hackMeet",
      title: "Animation Toys 2",
      description:
        "Are you a software developer? Want to show off your skills? Two days of programming with a very active community of growth oriented developers gathered in one virtual place to help each other learn. Come join a fun and challenging coding competition, learn new skills, and meet new people from the comfort of your own home with Mintbean Hackathons.",
      instructions: "See https://sites.google.com/mintbean.io/2020-06-01-animation-toys/home",
      registerLink: "http://eventbrite.com",
      coverImageUrl: "https://www.grafik.com.au/wp-content/uploads/2019/06/think-design.png",
      startTime: "2020-09-30T13:00:00",
      endTime: "2020-09-30T17:00:00",
      createdAt: "2020-08-15",
      kanbanCanonId: "00000000-0000-0000-0000-000000000000",
    },
    {
      id: "00000000-0000-4000-a000-000000000000",
      meetType: "hackMeet",
      title: "Algolia gives you super powers 3",
      description:
        "Hack in our Mintbean JavaScript Campus Playoffs! This is a FACE-OFF with other individual devs from other coding bootcamps, colleges, and universities. Show off your school pride and represent them in our weekend long javascript hackathon!",
      instructions: "See https://sites.google.com/mintbean.io/2020-06-03-algolia-gives-you-s/home",
      registerLink: "http://eventbrite.com",
      coverImageUrl: "https://i.pinimg.com/originals/9c/12/84/9c128435562961b0c9ff32d1072b6f80.png",
      startTime: "2020-10-15T13:00:00",
      endTime: "2020-10-15T17:00:00",
      createdAt: "2020-10-15",
    },
    {
      id: "6d32252b-c85c-45d3-8f55-dd05d2e9cfd0",
      meetType: "hackMeet",
      title: "Hack the Hack",
      description:
        "Are you a software developer? Want to show off your skills? Two days of programming with a very active community of growth oriented developers gathered in one virtual place to help each other learn. Come join a fun and challenging coding competition, learn new skills, and meet new people from the comfort of your own home with Mintbean Hackathons.",
      instructions: "See https://sites.google.com/mintbean.io/2020-06-01-animation-toys/home",
      registerLink: "http://eventbrite.com",
      coverImageUrl:
        "https://images.unsplash.com/photo-1515879218367-8466d910aaa4?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1050&q=80",
      startTime: nDaysAndHoursFromNowInWallClockTime(2),
      endTime: nDaysAndHoursFromNowInWallClockTime(2),
      createdAt: "2020-08-15",
    },
    {
      id: "87496d2d-ae36-4039-bd14-45bd0de3929c",
      meetType: "hackMeet",
      title: "Algolia gives you super powers 2",
      description:
        "Are you a software developer? Want to show off your skills? Two days of programming with a very active community of growth oriented developers gathered in one virtual place to help each other learn. Come join a fun and challenging coding competition, learn new skills, and meet new people from the comfort of your own home with Mintbean Hackathons.",
      instructions: "See https://sites.google.com/mintbean.io/2020-06-03-algolia-gives-you-s/home",
      registerLink: "http://eventbrite.com",
      coverImageUrl: "https://i.pinimg.com/originals/9c/12/84/9c128435562961b0c9ff32d1072b6f80.png",
      startTime: nDaysAndHoursFromNowInWallClockTime(4),
      endTime: nDaysAndHoursFromNowInWallClockTime(4),
      createdAt: "2020-09-01",
    },
    {
      id: "e093af41-8238-4fd6-ae2e-145497c3e038",
      meetType: "hackMeet",
      title: "Animation Toys 1",
      description:
        "Level up your Javascript and use an in-demand framework in the Vue.js Hackathon! Vue.js is an open source framework that emphasizes approachability, versatility and performance.",
      instructions: "See https://sites.google.com/mintbean.io/2020-06-01-animation-toys/home",
      registerLink: "http://eventbrite.com",
      coverImageUrl: "https://www.grafik.com.au/wp-content/uploads/2019/06/think-design.png",
      startTime: nDaysAndHoursFromNowInWallClockTime(7),
      endTime: nDaysAndHoursFromNowInWallClockTime(7),
      createdAt: "2020-09-01",
    },
    {
      id: "5ba2fc6b-e910-43dc-8dbc-75acd139ecfa",
      meetType: "hackMeet",
      title: "Algolia gives you super powers",
      description:
        "Level up your Javascript and use an in-demand framework in the Vue.js Hackathon! Vue.js is an open source framework that emphasizes approachability, versatility and performance.",
      instructions: "See https://sites.google.com/mintbean.io/2020-06-03-algolia-gives-you-s/home",
      registerLink: "http://eventbrite.com",
      coverImageUrl: "https://i.pinimg.com/originals/9c/12/84/9c128435562961b0c9ff32d1072b6f80.png",
      startTime: nDaysAndHoursFromNowInWallClockTime(12),
      endTime: nDaysAndHoursFromNowInWallClockTime(12),
      createdAt: "2020-09-01",
    },
  ]);
}
