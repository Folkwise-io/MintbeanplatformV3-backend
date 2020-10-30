import { UserInputError } from "apollo-server-express";

/* eslint-disable  @typescript-eslint/no-explicit-any */
export const validateAtLeastOneFieldPresent = (input: { [key: string]: any }) => {
  if (Object.keys(input).length === 0) {
    throw new UserInputError("Must edit at least one field!");
  }
};
/* eslint-enable  @typescript-eslint/no-explicit-any */
