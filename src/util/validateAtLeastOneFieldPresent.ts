import { UserInputError } from "apollo-server-express";

// eslint-disable-next-line
export const validateAtLeastOneFieldPresent = (input: { [key: string]: any }) => {
  if (Object.keys(input).length === 0) {
    throw new UserInputError("Must edit at least one field!");
  }
};
