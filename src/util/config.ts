import dotenv from "dotenv";
dotenv.config();

const CONVERTERS = {
  toNumber<T>(val: T): number {
    return +val;
  },
};

const getValue = (key: string): string | undefined => process.env[key];

const hoc = (key: string, _opts = {}) => {
  const defaults = {
    required: true,
    defaultValue: "",
    convert<T>(val: T): T {
      return val;
    },
  };

  const opts = { ...defaults, ..._opts };

  const val = opts.convert(getValue(key));

  if (opts.required && !val) {
    throw new Error(
      `CRITICAL ERROR: Value for config variable [${key}] was not provided. Check env file. (Hint: did you update the test env also?)`,
    );
  }

  return val || opts.defaultValue;
};

export default {
  dbDatabase: hoc("DB_DATABASE"),
  dbUsername: hoc("DB_USERNAME"),
  dbPassword: hoc("DB_PASSWORD"),
  dbHost: hoc("DB_HOST"),
  dbPort: hoc("DB_PORT", { convert: CONVERTERS.toNumber }),
  jwtSecret: hoc("JWT_SECRET"),
  sendgridKey: hoc("SENDGRID_KEY"),
  senderEmail: hoc("SENDER_EMAIL"),
  contactFormRecipientEmails: hoc("CONTACT_FORM_RECIPIENT_EMAILS", {
    defaultValue: "info@mintbean.io",
  }),
  disableRegistrationEmail: hoc("DISABLE_REGISTRATION_EMAILS", { defaultValue: false, required: false }),
  disableNewMeetReminders: hoc("DISABLE_NEW_MEET_REMINDERS", { defaultValue: false, required: false }), // disable queuing of meet email reminders for newly created meets
};
