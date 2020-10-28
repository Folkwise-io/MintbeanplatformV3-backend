/* eslint-disable  @typescript-eslint/no-explicit-any */
export const deleteUndefinedKeys = (obj: { [key: string]: any }): { [key: string]: any } => {
  const prunedObj: any = {};
  for (const [key, value] of Object.entries(obj)) {
    prunedObj[key] = value;
  }
  return prunedObj;
};
/* eslint-enable  @typescript-eslint/no-explicit-any */
