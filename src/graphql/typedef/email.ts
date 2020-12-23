import { gql } from "apollo-server-express";
/* These types are only for light emails that come in through resolver from client (contact form emails). They by-pass the scheduledEmails queue and go straight to the email API*/
const email = gql`
  enum EmailResponseStatus {
    SUCCESS
    BAD_REQUEST
    API_SERVER_ERROR
    UNKNOWN_ERROR
  }

  type EmailResponseError {
    message: String!
    info: String
  }

  "Normalized response from email API"
  type EmailResponse {
    "Email address of one or more recipients"
    recipient: String!
    sender: String!
    statusCode: Int!
    status: EmailResponseStatus!
    timestamp: String!
    meetId: UUID
    errors: [EmailResponseError]
  }

  "The input needed to send an contact form email. Inlude all information relevant to the contact (such as sender name and email) in html body."
  input SendContactFormEmailInput {
    "Email subject"
    subject: String!
    "HTML body of email, including sender details"
    html: String!
  }

  extend type Mutation {
    "For sending light client emails, like contact form emails. By-passes scheduledEmail queue."
    sendContactFormEmail(input: SendContactFormEmailInput!): EmailResponse!
  }
`;

export default email;
