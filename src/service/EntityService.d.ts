export interface Args {
  [key: string]: string;
}

export interface EntityService<T> {
  getMany: (args: Args) => T[];
  getOne: (args: Args) => T;
}
