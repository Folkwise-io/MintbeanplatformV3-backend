export interface Args {
  [key: string]: string;
}

export interface EntityService<T> {
  getOne: (args: Args) => T;
  getMany: (args: Args) => T[];
}
