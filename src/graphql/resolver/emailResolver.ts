import { Email } from "../../types/Email";
import { EmailService } from "../../service/EmailService";
import { Resolvers } from "../../types/gqlGeneratedTypes";
import EmailResolverValidator from "../../validator/EmailResolverValidator";
import MeetService from "../../service/MeetService";

const emailResolver = (emailResolverValidator: EmailResolverValidator, emailService: EmailService, meetService: MeetService): Resolvers => {
  return {
    Mutation: {
      sendTestEmail: (): Promise<boolean> => {
        const testEmail: Email = {
          to: "jimmy.peng@mintbean.io",
          from: "jimmy.peng@mintbean.io",
          subject: "hi",
          html: `
<html>
  <head>
    <script type="application/ld+json">
    {
      "@context": "http://schema.org",
      "@type": "EventReservation",
      "reservationNumber": "E123456789",
      "reservationStatus": "http://schema.org/Confirmed",
      "underName": {
        "@type": "Person",
        "name": "John Smith"
      },
      "reservationFor": {
        "@type": "Event",
        "name": "MB JavaScript Hacks: Quiz App Showdown - https://mintbean.io/meets/3d9c6cc8-4f1b-4ac8-9f6e-2896acad40e1",
        "startDate": "2020-10-07T19:30:00-08:00",
        "location": {
          "@type": "Place",
          "name": "Mintbean",
          "address": {
            "@type": "PostalAddress",
            "addressLocality": "Toronto",
            "addressRegion": "ON"
          },
          "url": "https://mintbean.io"
        }
      }
    }
    </script>
  </head>
  <body>
    <p>
      This a test for an event schema in Gmail.
    </p>
  </body>
</html>
`,
        };
        return emailService.sendEmail(testEmail);
      },
    },
  };
};

export default emailResolver;
