export interface Args {
  [key: string]: string;
}

export interface EntityService<T> {
  getOne: (args: Args) => Promise<T>;
  getMany: (args: Args) => Promise<T[]>;
}
