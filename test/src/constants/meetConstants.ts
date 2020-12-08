import { gql } from "apollo-server-express";
import { CreateMeetInput, EditMeetInput, Meet, MeetType } from "../../../src/types/gqlGeneratedTypes";

const detailedDescription =
  "*Mintbean Startups is a supportive online community of entrepreneurs building early-stage software companies. Onwards and upwards!*\n# Mintbean Startups\n## About the Event | How to Recruit Programmers for a Startup\n\nFinding developers as a startup is like finding a very small needle in a very big haystack.\n\n* In a job market that is in favour of the candidate, how do you stand out as a company?\n* With limited time and budget, how can you efficiently filter technical resumes?\n* What is the best way to vet candidates' technical skillset?\n* When and where should you post your job description?\n\nMonarch Wadia, CEO and full stack architect, has nearly 10 years of experience in the software development industry. He is the founder of Mintbean and of Zero Projects. He will answer these questions as a deep expert in the field.\n\n## Speaker | [Monarch Wadia](https://www.linkedin.com/in/monarchwadia/)\n\n> “Software development isn’t just business logic. It’s people, culture and most importantly relationships”- Monarch Wadia\n\nMonarch Wadia is the CEO of Mintbean and Zero Projects. He has nearly 10 years of experience as a hands-on software developer. When he’s not building extremely well-architected software applications, he’s producing large online hackthons, hosting webinars and mentoring developers. Under his guidance, the Mintbean community has done over 300+ virtual hackathons, technical workshops and webinars in 2020, helping educate the dev community and helping bright minds get ahead in their careers.\n\nHis software development firm, Zero Projects, routinely helps SaaS firms, Fintech companies, logistics giants and well-known startups build complex components and critical software applications for their businesses. In his career, Monarch has built and architected applications for well-know multinational enterprise companies as well as startups, having led teams of up to 150+ Java and JavaScript developers.\n\n## Who can attend?\n\n* Startup founders\n* CEOs\n* CTOs\n* HRs\n* Project managers\n* Talent Acquisition\n\n## Meetup Details\n\n**Date**: Thursday, December 10, 2020\n\n**Time**: 6:00PM EST/ 3:00PM PST/ 5:00PM CST\n\n**Where**: Zoom\n\n***Zoom link with be emailed to you 30mins before the event!**\n## About Us\n\nMintbean Startups is a supportive online community of entrepreneurs building early-stage software companies. We offer online-only workshops, lectures, networking events and access to a like-minded and helpful community on our Slack chatroom. Onwards and upwards! 🚀\n\nFollow us on our social media: [LinkedIn](https://www.linkedin.com/showcase/mintbean-startups)\n\nWe're very excited for you to participate!\n";

export const PAPERJS: Meet = {
  id: "00000000-0000-0000-0000-000000000000",
  meetType: MeetType.Hackathon,
  title: "Animation Toys",
  description: "Building impressive portfolio projects with PaperJS.",
  instructions: "See https://sites.google.com/mintbean.io/2020-06-01-animation-toys/home",
  registerLink: "http://eventbrite.com",
  coverImageUrl: "https://www.grafik.com.au/wp-content/uploads/2019/06/think-design.png",
  startTime: "2024-09-30T13:00:00.000",
  endTime: "2024-09-30T17:00:00.000",
  createdAt: "2020-08-15T12:00:00.000Z",
  updatedAt: "2020-08-15T12:00:00.000Z",
  region: "America/Toronto",
};

export const ALGOLIA: Meet = {
  id: "00000000-0000-4000-a000-000000000000",
  meetType: MeetType.Hackathon,
  title: "Algolia gives you super powers",
  description: "Buiilding impressive portfolio projects with Algolia.",
  detailedDescription: detailedDescription,
  instructions: "See https://sites.google.com/mintbean.io/2020-06-03-algolia-gives-you-s/home",
  registerLink: "http://eventbrite.com",
  coverImageUrl: "https://i.pinimg.com/originals/9c/12/84/9c128435562961b0c9ff32d1072b6f80.png",
  startTime: "2024-10-15T13:00:00.000",
  endTime: "2024-10-15T17:00:00.000",
  createdAt: "2020-10-15T12:00:00.000Z",
  updatedAt: "2020-10-15T12:00:00.000Z",
  region: "America/Toronto",
};

export const GET_MEET_QUERY = gql`
  query getMeetById($id: UUID!) {
    meet(id: $id) {
      id
      meetType
      title
      description
      detailedDescription
      instructions
      registerLink
      coverImageUrl
      startTime
      endTime
      createdAt
      updatedAt
      region
      kanbanCanonId
      kanbanCanon {
        id
        title
        description
      }
      kanban {
        userId
        kanbanCanonId
        createdAt
        updatedAt
        meetId
        id
        title
        description
        kanbanCards {
          id
          title
          body
        }
      }
    }
  }
`;

export const GET_ALL_MEETS = gql`
  query getAllMeets {
    meets {
      id
      meetType
      title
      description
      instructions
      registerLink
      coverImageUrl
      startTime
      endTime
      createdAt
      updatedAt
      region
      kanbanCanonId
      kanbanCanon {
        id
        title
        description
      }
    }
  }
`;

export const CREATE_MEET = gql`
  mutation createMeet($input: CreateMeetInput!) {
    createMeet(input: $input) {
      id
      meetType
      title
      description
      detailedDescription
      instructions
      registerLink
      coverImageUrl
      startTime
      endTime
      createdAt
      updatedAt
      region
    }
  }
`;

export const NEW_MEET_INPUT: CreateMeetInput = {
  meetType: MeetType.Lecture,
  title: "Color Palette Generator",
  description: "Exploring pre-existing color libraries while building visually impressive projects.",
  detailedDescription: detailedDescription,
  instructions: "See https://sites.google.com/mintbean.io/2020-06-08-color-scheme-genera/home",
  registerLink: "http://google.com",
  coverImageUrl: "https://graf1x.com/wp-content/uploads/2014/09/color-wheel-poster.jpg",
  startTime: "2024-06-08T12:00:00.000",
  endTime: "2024-06-08T16:00:00.000",
  region: "America/Toronto",
};

export const EDIT_MEET = gql`
  mutation editMeet($id: UUID!, $input: EditMeetInput!) {
    editMeet(id: $id, input: $input) {
      id
      meetType
      title
      description
      instructions
      registerLink
      coverImageUrl
      startTime
      endTime
      createdAt
      region
      updatedAt
    }
  }
`;

export const EDIT_MEET_INPUT: EditMeetInput = {
  title: "Colour Palette Generator",
  registerLink: "http://yahoo.com",
};

export const DELETE_MEET = gql`
  mutation deleteMeet($id: UUID!) {
    deleteMeet(id: $id)
  }
`;

export const GET_REGISTERLINK_STATUS = gql`
  query getMeetRegisterLinkStatusById($id: UUID!) {
    meet(id: $id) {
      registerLink
      registerLinkStatus
    }
  }
`;
