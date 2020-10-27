// Maps args keys to prefixed keys. Useful for sql query strings
// ex: { key: value } => { "prefix.key": value }

/* eslint-disable  @typescript-eslint/no-explicit-any */
export const prefixKeys = (prefix: string, args: { [key: string]: any }): { [key: string]: any } => {
  const prefixedArgs: any = {};
  for (const [key, value] of Object.entries(args)) {
    prefixedArgs[`${prefix}.${key}`] = value;
  }
  return prefixedArgs;
};
/* eslint-enable  @typescript-eslint/no-explicit-any */
