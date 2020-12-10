import * as Knex from "knex";
import { MeetType } from "../../types/gqlGeneratedTypes";
import { nDaysAndHoursFromNowInWallClockTime } from "../../util/timeUtils";

export async function seed(knex: Knex): Promise<void> {
  await knex("meets").del();

  await knex("meets").insert([
    {
      id: "00000000-0000-0000-0000-000000000000",
      meetType: MeetType.Hackathon,
      title: "Animation Toys 2",
      description:
        "Are you a software developer? Want to show off your skills? Two days of programming with a very active community of growth oriented developers gathered in one virtual place to help each other learn. Come join a fun and challenging coding competition, learn new skills, and meet new people from the comfort of your own home with Mintbean Hackathons.",
      detailedDescription:
        "*Mintbean Startups is a supportive online community of entrepreneurs building early-stage software companies. Onwards and upwards!*\n# Mintbean Startups\n## About the Event | How to Recruit Programmers for a Startup\n\nFinding developers as a startup is like finding a very small needle in a very big haystack.\n\n* In a job market that is in favour of the candidate, how do you stand out as a company?\n* With limited time and budget, how can you efficiently filter technical resumes?\n* What is the best way to vet candidates' technical skillset?\n* When and where should you post your job description?\n\nMonarch Wadia, CEO and full stack architect, has nearly 10 years of experience in the software development industry. He is the founder of Mintbean and of Zero Projects. He will answer these questions as a deep expert in the field.\n\n## Speaker | [Monarch Wadia](https://www.linkedin.com/in/monarchwadia/)\n\n> “Software development isn’t just business logic. It’s people, culture and most importantly relationships”- Monarch Wadia\n\nMonarch Wadia is the CEO of Mintbean and Zero Projects. He has nearly 10 years of experience as a hands-on software developer. When he’s not building extremely well-architected software applications, he’s producing large online hackthons, hosting webinars and mentoring developers. Under his guidance, the Mintbean community has done over 300+ virtual hackathons, technical workshops and webinars in 2020, helping educate the dev community and helping bright minds get ahead in their careers.\n\nHis software development firm, Zero Projects, routinely helps SaaS firms, Fintech companies, logistics giants and well-known startups build complex components and critical software applications for their businesses. In his career, Monarch has built and architected applications for well-know multinational enterprise companies as well as startups, having led teams of up to 150+ Java and JavaScript developers.\n\n## Who can attend?\n\n* Startup founders\n* CEOs\n* CTOs\n* HRs\n* Project managers\n* Talent Acquisition\n\n## Meetup Details\n\n**Date**: Thursday, December 10, 2020\n\n**Time**: 6:00PM EST/ 3:00PM PST/ 5:00PM CST\n\n**Where**: Zoom\n\n***Zoom link with be emailed to you 30mins before the event!**\n## About Us\n\nMintbean Startups is a supportive online community of entrepreneurs building early-stage software companies. We offer online-only workshops, lectures, networking events and access to a like-minded and helpful community on our Slack chatroom. Onwards and upwards! 🚀\n\nFollow us on our social media: [LinkedIn](https://www.linkedin.com/showcase/mintbean-startups)\n\nWe're very excited for you to participate!\n",
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
      meetType: MeetType.Hackathon,
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
      meetType: MeetType.Hackathon,
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
      meetType: MeetType.Hackathon,
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
      meetType: MeetType.Hackathon,
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
      meetType: MeetType.Hackathon,
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
