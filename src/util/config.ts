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
    throw new Error(`CRITICAL ERROR: Value for config variable [${key}] was not provided. Check env file.`);
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
  sendGridKey: hoc("SENDGRID_KEY"),
};
