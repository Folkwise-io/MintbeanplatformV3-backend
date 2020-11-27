import { UserInputError } from "apollo-server-express";
import * as yup from "yup";

// TODO: figure out how to dynamically type yup Schemas. Using 'any' for now
// eslint-disable-next-line
export const validateAgainstSchema = <I>(schema: yup.Schema<any>, input: I) => {
  try {
    schema.validateSync(input);
  } catch (e) {
    throw new UserInputError(e.message);
  }
};
