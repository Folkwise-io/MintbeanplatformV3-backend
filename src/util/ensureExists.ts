import { ApolloError } from "apollo-server-express";

export const ensureExists = <T>(entityName: string) => (entity: T | undefined) => {
  if (!entity) {
    throw new ApolloError(`${entityName} does not exist`);
  } else {
    return entity;
  }
};
