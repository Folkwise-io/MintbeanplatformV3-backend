import { AuthenticationError } from "apollo-server-express";
import { ServerContext } from "../buildServerContext";

// TODO: Refactor this Jimmy method to be reused for admin validations in all scenarios, not just email
export default function ensureAdmin(context: ServerContext): void {
  if (!context.getIsAdmin()) {
    throw new AuthenticationError("You must be an admin to send emails!");
  }
}
