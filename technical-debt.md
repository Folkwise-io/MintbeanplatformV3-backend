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

### [S] Refactor all tests to test for error CODES instead of error MESSAGES

Check for one of the 3 apollo error types used in this application :

- "UNAUTHENTICATED"
- "BAD_USER_INPUT"
- "INTERNAL_SERVER_ERROR"

See kanban related tests for reference. There is probably a more elegant way to do this, for example creating an `expectErrorUnauthenticated()`, `expectErrorBadUserInput()` etc. methods on the test manager, and changing error codes to constants.

### [S] Refactor validations to throw more generic (resuable) error messages

Make helpers like `ensureAdmin(context)` instead of below:

```
if (!context.getIsAdmin()) {
  throw new AuthenticationError("You are not authorized to delete kanban canons!");
}
```
