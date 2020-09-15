import { ServerContext } from "../buildContext";

export interface Args {
  [key: string]: string;
}

export interface EntityService<T> {
  getOne: (args: Args, context: ServerContext) => Promise<T>;
  getMany: (args: Args, context: ServerContext) => Promise<T[]>;
  addOne: (args: any, context: ServerContext) => Promise<T>; // Q: How to type args better?
}
