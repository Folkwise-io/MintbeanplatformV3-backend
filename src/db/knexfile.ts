import config from "../util/config";
import path from "path";

const { dbDatabase, dbUsername, dbPassword, dbHost, dbPort } = config;

export default {
  client: "postgresql",
  connection: {
    host: dbHost,
    port: dbPort,
    database: dbDatabase,
    user: dbUsername,
    password: dbPassword,
  },
  pool: {
    min: 2,
    max: 10,
  },
  migrations: {
    directory: path.join(__dirname, "/migrations"),
  },
  seeds: {
    directory: path.join(__dirname, "/seeds"),
  },
};
