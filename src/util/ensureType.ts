import { UserInputError } from "apollo-server-express";

// For on-the-fly type checking of primative types
export const ensureType = <T>(entity: T, entityName: string, type: string) => (entity: T) => {
  if (!entity || typeof entity !== type) {
    throw new UserInputError(`Expected ${entityName} to have a value of type ${type}.`);
  }
};
