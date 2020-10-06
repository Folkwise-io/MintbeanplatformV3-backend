import { gql } from "apollo-server-express";

const email = gql`
  extend type Mutation {
    "Sends a test email (admin-only)"
    sendTestEmail: Boolean!

    "Sends a reminder email to registrants of a meet (admin-only)"
    sendReminderEmailForMeet(meetId: UUID!): Boolean!
  }
`;

export default email;
