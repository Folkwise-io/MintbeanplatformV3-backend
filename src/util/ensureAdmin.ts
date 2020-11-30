import { AuthenticationError } from "apollo-server-express";
import { ServerContext } from "../buildServerContext";

export default function ensureAdmin(context: ServerContext): void {
  if (!context.getIsAdmin()) {
    throw new AuthenticationError("You are not authorized to do that.");
  }
}
