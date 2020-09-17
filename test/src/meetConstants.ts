import { gql } from "apollo-server-express";
import { CreateMeetInput, Meet } from "../../src/types/gqlGeneratedTypes";

export const PAPERJS: Meet = {
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

export const ALGOLIA: Meet = {
  id: "00000000-0000-4000-a000-000000000000",
  meetType: "hackMeet",
  title: "Algolia gives you super powers",
  description: "Buiilding impressive portfolio projects with Algolia.",
  instructions: "See https://sites.google.com/mintbean.io/2020-06-03-algolia-gives-you-s/home",
  registerLink: "http://eventbrite.com",
  coverImageUrl: "https://i.pinimg.com/originals/9c/12/84/9c128435562961b0c9ff32d1072b6f80.png",
  startTime: "2020-10-15T13:00:00.000",
  endTime: "2020-10-15T17:00:00.000",
  createdAt: "2020-10-15T12:00:00.000Z",
  updatedAt: "2020-08-15T12:00:00.000Z",
  region: "America/Toronto",
};

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
      region
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
      instructions
      registerLink
      coverImageUrl
      startTime
      endTime
      createdAt
      region
    }
  }
`;

export const NEW_MEET_INPUT: CreateMeetInput = {
  meetType: "hackMeet",
  title: "Color Palette Generator",
  description: "Exploring pre-existing color libraries while building visually impressive projects.",
  instructions: "See https://sites.google.com/mintbean.io/2020-06-08-color-scheme-genera/home",
  registerLink: "http://google.com",
  coverImageUrl: "https://graf1x.com/wp-content/uploads/2014/09/color-wheel-poster.jpg",
  startTime: "2020-06-08T12:00:00",
  endTime: "2020-06-08T16:00:00",
  region: "America/Toronto",
};
