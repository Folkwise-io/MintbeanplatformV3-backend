export interface Args {
  [key: string]: string;
}

export interface ResolverService<T> {
  getMany: (args: Args) => T[];
  getOne: (args: Args) => T;
}
