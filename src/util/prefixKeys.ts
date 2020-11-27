// Maps args keys to prefixed keys. Useful for sql query strings
// ex: { key: value } => { "prefix.key": value }

// eslint-disable-next-line
export const prefixKeys = (prefix: string, args: { [key: string]: any }): { [key: string]: any } => {
  // eslint-disable-next-line
  const prefixedArgs: any = {};
  for (const [key, value] of Object.entries(args)) {
    prefixedArgs[`${prefix}.${key}`] = value;
  }
  return prefixedArgs;
};
