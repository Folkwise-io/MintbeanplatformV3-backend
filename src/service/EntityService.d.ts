import { ServerContext } from "../buildContext";

export interface Args {
  [key: string]: string;
}

export interface EntityService<T> {
  getOne: (args: any, context: ServerContext) => Promise<T>;
  getMany: (args: Args, context: ServerContext) => Promise<T[]>;
  addOne: (input: any, context: ServerContext) => Promise<T>; // Q: How to type args better?
}
