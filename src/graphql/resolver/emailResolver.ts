import { Email } from "../../types/Email";
import { EmailService } from "../../service/EmailService";
import { Meet, Resolvers } from "../../types/gqlGeneratedTypes";
import EmailResolverValidator from "../../validator/EmailResolverValidator";
import MeetService from "../../service/MeetService";
import { ServerContext } from "../../buildServerContext";
import { ensureExists } from "../../util/ensureExists";

const emailResolver = (
  emailResolverValidator: EmailResolverValidator,
  emailService: EmailService,
  meetService: MeetService,
): Resolvers => {
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
      sendReminderEmailForMeet: async (_root, { input }, context: ServerContext) => {
        const meet = ensureExists<Meet>("Meet")(await meetService.getOne({ id: input.meetId }));
        const email = emailService.generateMeetReminderEmail("jimmy.peng@mintbean.io", meet);
        return emailService.sendEmail(email);
      },
    },
  };
};

export default emailResolver;
