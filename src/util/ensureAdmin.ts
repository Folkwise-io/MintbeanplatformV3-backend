import { AuthenticationError } from "apollo-server-express";
import { ServerContext } from "../buildServerContext";

export default function ensureAdmin(context: ServerContext): void {
  if (!context.getIsAdmin()) {
    throw new AuthenticationError("You must be an admin to send emails!");
  }
}
