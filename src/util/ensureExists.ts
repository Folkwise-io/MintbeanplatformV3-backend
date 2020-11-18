import { ApolloError } from "apollo-server-express";

export const ensureExists = <T>(entityName: string) => <T>(entity: T | undefined): T => {
  if (!entity) {
    throw new ApolloError(`${entityName} does not exist`);
  } else {
    return entity;
  }
};
