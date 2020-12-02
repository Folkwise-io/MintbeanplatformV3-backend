import { ApolloError } from "apollo-server-express";

type AnyFunction<T> = () => T;

export default function handleDatabaseError<R>(cb: AnyFunction<Promise<R>>): Promise<R> {
  try {
    return cb();
  } catch (e) {
    console.log(e);
    throw new ApolloError("INTERNAL SERVER ERROR");
  }
}
