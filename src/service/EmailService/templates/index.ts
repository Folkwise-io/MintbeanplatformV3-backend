import { EmailTemplateName } from "../../../types/Email";
import { /* render, */ renderFile } from "../../../util/templatingUtils";
import { EmailContext } from "../EmailContextBuilder";
import path from "path";

export type EmailTemplates = {
  [key in EmailTemplateName]: {
    subject: (context: EmailContext) => string;
    html: (context: EmailContext) => string;
  };
};

const {
  HACKATHON_REGISTRATION_CONFIRM,
  WORKSHOP_REGISTRATION_CONFIRM,
  HACKATHON_REMINDER_1,
  HACKATHON_REMINDER_2,
  WORKSHOP_REMINDER_1,
  WORKSHOP_REMINDER_2,
} = EmailTemplateName;

export const templates: EmailTemplates = {
  //TODO: Supply templates with appropriate subject/html
  [HACKATHON_REGISTRATION_CONFIRM]: {
    subject: (context) => "TODO",
    html: (context) => renderFile(path.join(__dirname, "hackathons/TODO.ejs"), context),
  },
  [WORKSHOP_REGISTRATION_CONFIRM]: {
    subject: (context) => "TODO",
    html: (context) => renderFile(path.join(__dirname, "hackathons/TODO.ejs"), context),
  },
  [HACKATHON_REMINDER_1]: {
    subject: (context) => "TODO",
    html: (context) => renderFile(path.join(__dirname, "hackathons/TODO.ejs"), context),
  },
  [HACKATHON_REMINDER_2]: {
    subject: (context) => "TODO",
    html: (context) => renderFile(path.join(__dirname, "hackathons/TODO.ejs"), context),
  },
  [WORKSHOP_REMINDER_1]: {
    subject: (context) => "TODO",
    html: (context) => renderFile(path.join(__dirname, "hackathons/TODO.ejs"), context),
  },
  [WORKSHOP_REMINDER_2]: {
    subject: (context) => "TODO",
    html: (context) => renderFile(path.join(__dirname, "hackathons/TODO.ejs"), context),
  },
};
