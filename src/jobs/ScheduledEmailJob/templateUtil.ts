import ejs from "ejs";
import * as fs from "fs";
import path from "path";
import { EmailContext } from "../../service/EmailService";
import { Meet } from "../../types/gqlGeneratedTypes";
import { User } from "../../types/User";

const template = (templateString: string, emailContext: EmailContext) => {
  return ejs.render(templateString, emailContext);
};

interface TemplateData {
  meet?: Meet;
  recipient: User;
}

interface TemplateResult {
  subject: string;
  body: string;
}

export const templateByName = (templateName: string, data: TemplateData): TemplateResult => {
  const subjectTemplate = fs.readFileSync(pathToTemplate(templateName, "subject.ejs"), "utf-8");
  const bodyTemplate = fs.readFileSync(pathToTemplate(templateName, "body.ejs"), "utf-8");
  const subject = ejs.render(subjectTemplate, data);
  const body = ejs.render(bodyTemplate, data);

  return { subject, body };
};

export const templateExists = (templateName: string): boolean => {
  const subjectFileExists = fs.existsSync(pathToTemplate(templateName, "subject.ejs"));
  const bodyFileExists = fs.existsSync(pathToTemplate(templateName, "body.ejs"));
  return subjectFileExists && bodyFileExists;
};

function pathToTemplate(templateName: string, fileName: string): string {
  return path.join(__dirname, "templates", templateName, fileName);
}
