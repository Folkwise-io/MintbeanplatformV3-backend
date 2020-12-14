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

### [S] Add meet validations for edit/create

Meet entities are missing validations in backend. Align with frontend meet create/edit forms.
\*Note: only do this after an upper character limit for short description has been established.

### yarn jest is dangerous

Running `jest` or `yarn jest` clobbers the database that is defined in the root `.env` file.

Expected behaviour:
`yarn jest` or `jest` work on a test version of the database.

Actual behaviour:
`yarn jest` and `jest` work on the database defined in `/.env`. This is dangerous.

Repro steps:

1. Open up the UI and do something that affects the DB
2. Run `yarn test`. Everything is fine.
3. Now, run `jest`. You'll see that the database was wiped by the tests.

There must be a better way of definining DB variables in test mode.
