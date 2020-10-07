import { gql } from "apollo-server-express";

const email = gql`
  input TestEmailInput {
    subject: String!
    body: String!
  }

  input MeetReminderEmailInput {
    meetId: UUID!
    subject: String!
    body: String!
  }

  extend type Mutation {
    "Sends a test email (admin-only)"
    sendTestEmail(input: TestEmailInput!): Boolean!

    "Sends a reminder email to registrants of a meet (admin-only)"
    sendReminderEmailForMeet(input: MeetReminderEmailInput!): Boolean!

    "Sends a sample registration email with json-ld for Google whitelist approval (admin-only)"
    sendSampleRegistrationEmailForMeet(meetId: UUID!): Boolean!
  }
`;

export default email;
