import { ApolloError } from "apollo-server-express";

export default async function handleDatabaseError(cb: Function) {
  try {
    return await cb();
  } catch (e) {
    console.log(e);
    throw new ApolloError("INTERNAL SERVER ERROR");
  }
}
