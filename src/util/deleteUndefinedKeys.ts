// eslint-disable-next-line
export const deleteUndefinedKeys = (obj: { [key: string]: any }): { [key: string]: any } => {
  // eslint-disable-next-line
  const prunedObj: any = {};
  for (const [key, value] of Object.entries(obj)) {
    prunedObj[key] = value;
  }
  return prunedObj;
};
