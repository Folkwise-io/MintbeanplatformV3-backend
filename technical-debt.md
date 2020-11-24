# Technical debt log

This is a log of technical debt that needs to be addressed.

Update anytime you find something smelly in the code that can't be addressed in your current working branch. Label each issue with it's time-complexity in "T-shirt size": [S] (< 1hr), [M] (1-3 hrs), [L] (3+ hrs)

### [S] Refactor ensureExists function to not require explicit generics

Once `ensureExists` typing has been updated like below, remove generics from all `ensureExists` calls

```ts
export const ensureExists = <T>(entityName: string) => <T>(entity: T | undefined): T => {
  if (!entity) {
    throw new ApolloError(`${entityName} does not exist`);
  } else {
    return entity;
  }
};
```

### [M] Remove v7.sql from git history

added in commit 509a88a7773d3b061a756835e2d3a15947d75c89
https://github.com/Mintbean/MintbeanplatformV3-backend/pull/40/commits/509a88a7773d3b061a756835e2d3a15947d75c89
