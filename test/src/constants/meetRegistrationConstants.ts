import { gql } from "apollo-server-express";
import { Meet } from "../../../src/types/gqlGeneratedTypes";
import { nDaysAndHoursFromNowInWallClockTime } from "../../../src/util/timeUtils";
import MeetRegistration from "../../../src/types/MeetRegistration";
import { AMY } from "./userConstants";

export const GET_USER_REGISTERED_MEETS_QUERY = gql`
  query getOneUser($id: UUID!) {
    user(id: $id) {
      firstName
      lastName
      registeredMeets {
        id
        title
        description
      }
    }
  }
`;

export const GET_MY_REGISTERED_MEETS_QUERY = gql`
  query myRegisteredMeets {
    me {
      firstName
      lastName
      registeredMeets {
        id
        title
        description
      }
    }
  }
`;

export const GET_REGISTRANTS_FOR_MEET_QUERY = gql`
  query getRegistrantsOfMeet($id: UUID!) {
    meet(id: $id) {
      id
      title
      description
      registrants {
        id
        firstName
        lastName
      }
    }
  }
`;

export const REGISTER_FOR_MEET_QUERY = gql`
  mutation registerForMeet($meetId: UUID!) {
    registerForMeet(meetId: $meetId)
  }
`;

export const ANIMATION_TOYS_2: Meet = {
  id: "e093af41-8238-4fd6-ae2e-145497c3e038",
  meetType: "hackMeet",
  title: "Animation Toys 2",
  description: "Building impressive portfolio projects with PaperJS.",
  instructions: "See https://sites.google.com/mintbean.io/2020-06-01-animation-toys/home",
  registerLink: "http://eventbrite.com",
  coverImageUrl: "https://www.grafik.com.au/wp-content/uploads/2019/06/think-design.png",
  startTime: nDaysAndHoursFromNowInWallClockTime(7),
  endTime: nDaysAndHoursFromNowInWallClockTime(7),
  createdAt: "2020-09-01",
  updatedAt: "2020-09-01",
  region: "America/Toronto",
};

export const ALGOLIA_3: Meet = {
  id: "5ba2fc6b-e910-43dc-8dbc-75acd139ecfa",
  meetType: "hackMeet",
  title: "Algolia gives you super powers 3",
  description: "Buiilding impressive portfolio projects with Algolia.",
  instructions: "See https://sites.google.com/mintbean.io/2020-06-03-algolia-gives-you-s/home",
  registerLink: "http://eventbrite.com",
  coverImageUrl: "https://i.pinimg.com/originals/9c/12/84/9c128435562961b0c9ff32d1072b6f80.png",
  startTime: nDaysAndHoursFromNowInWallClockTime(12),
  endTime: nDaysAndHoursFromNowInWallClockTime(12),
  createdAt: "2020-09-01",
  updatedAt: "2020-09-01",
  region: "America/Toronto",
};

export const AMY_ANIMATION_TOYS_2_REGISTRATION: MeetRegistration = {
  id: AMY.id,
  userId: AMY.id,
  meetId: ANIMATION_TOYS_2.id,
  createdAt: "2020-09-01",
  updatedAt: "2020-09-01",
  deleted: false,
};
