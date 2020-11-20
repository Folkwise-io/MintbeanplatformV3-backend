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

### [S] Refactor validations to throw more generic (resuable) error messages

Make helpers like `ensureAdmin(context)` instead of below:

```
if (!context.getIsAdmin()) {
  throw new AuthenticationError("You are not authorized to delete kanban canons!");
}
```

### [S] Figure out why some moment tests fail after 4PM PST when run in PST timezone..

Maybe only Claire can tackle this one.

## [S] Make validation errors always return "BAD_USER_INPUT" apollo errors

Currently error like 'wrong input type' are being thrown as 'INTERNAL_SERVER_ERROR" because they are handled in `handleServerError`. The error type "BAD_USER_INPUT" would be more appropriate. Make sure resolver validators are throwing the correct error types and reflect this in the tests.

For reference, the 3 major apollo error types used in this application are shown below.

- AuthenticationError (code: "UNAUTHENTICATED")
- UserInputError (code: "BAD_USER_INPUT")
- ApolloError (code : "INTERNAL_SERVER_ERROR")

```
// you can inport and throw errors like so
import { AuthenticationError } from "apollo-server-express";

throw new AuthenticationError('This in an error message')
```
