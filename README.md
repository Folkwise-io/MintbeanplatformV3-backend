# Mintbean Platform V3 Backend

<!-- TOC auto-generated by Markdown Preview Enchanced VSCode extension-->
<!-- @import "[TOC]" {cmd="toc" depthFrom=2 depthTo=6 orderedList=false} -->

<!-- code_chunk_output -->

- [Installation](#installation)
- [Development](#development)
  - [Setting up the local database](#setting-up-the-local-database)
  - [Development workflow](#development-workflow)
    - [Auto-generating TypeScript types](#auto-generating-typescript-types)
    - [Adding new schemas](#adding-new-schemas)
  - [Running tests / TDD workflow](#running-tests-tdd-workflow)
  - [NPM Scripts Reference](#npm-scripts-reference)
  - [Knex CLI Reference](#knex-cli-reference)
- [Api Reference](#api-reference)

<!-- /code_chunk_output -->

## Installation

```sh
$ yarn install
```

## Development

Local development and tests are configured to use PostgreSQL in a Docker container.

_[Docker](https://docs.docker.com/get-docker/) must be installed and running for any development work._

### Setting up the local database

1. Start the PostgreSQL container with `yarn postgres`. Development roles and databases are automatically created on the initial run.

2. Run `cp .env.development .env` to use default development database variables during development.

3. Run `yarn pristine`, which resets the database and runs the migrations and seeds. You will need to re-run this command when the database schema is changed.
   **Warning: all existing data in the database will be lost!**

- You can access the PostgreSQL CLI with `yarn psql`. All column names that are in camelCase need double quotation marks when used in raw SQL queries (i.e. `SELECT body, "userId" from posts;`).

### Development workflow

1. [Setting up the local database](#setting-up-the-local-database)
2. Run `yarn dev` to start a GraphQL endpoint at `localhost:4000/graphql`.
3. Go to `localhost:4000/graphql` to use the GraphQL Playground.

#### Auto-generating TypeScript types

Running `yarn gen-types` auto-generates a TypeScript definition file using `graphql-codegen`. The tool reads the schema file in `./src/graphql/schema.ts` and outputs TypeScript definitions in `./src/graphql/generated/tsTypes.d.ts`. You may then import types directly from that file, such as:

```ts
 from "./generated/tsTypes";
```

Resolvers are also automatically typed, i.e:

```ts
import { Resolvers } from "../generated/tsTypes";

const postResolver: Resolvers = {
  Query: {
    // Rest of code
  },
};
```

Remember to run `yarn gen-types` after every schema change, to ensure `tsTypes` is up to date and you don't get TS errors. This is unnecessary if you're in hot-reload/watch mode with `yarn dev`, as the generator tool automatically watches for schema changes.

#### Adding new schemas

1. Create the new typeDef file for the entity in `./src/graphql/typedefs/entity.ts`.
2. Run `yarn gen-types` to update the `Resolvers` type in Typescript type so you can take advantage of typing when making the resolver.
3. Create a new resolver file for the entity in `./src/graphql/resolvers/entityResolver.ts`.
4. Add the typedef and resolver into the corresponding array of the schema generator file in `./src/graphql/schema.ts`.

### Running tests / TDD workflow

1. Start the PostgreSQL container with `yarn postgres`. Test roles and databases are automatically created on the initial run.

2. Run `yarn pristine` to set up the test database migrations.

3. Run `yarn test` for a single test with coverage report, or `yarn tdd` to run tests in watch mode as part of a TDD workflow.

### NPM Scripts Reference

| Script      | Description                                                                                        |
| ----------- | -------------------------------------------------------------------------------------------------- |
| `start`     | Starts the server with `ts-node`                                                                   |
| `dev`       | Starts the server with `ts-node` & hot-reload                                                      |
| `build`     | Builds `*.ts` in `./src` to `*.js` in `./build`                                                    |
| `db:reset`  | Drops and recreates all databases, nuking all the tables                                           |
| `gen-types` | See [above](#auto-generating-typescript-types)                                                     |
| `knex`      | Runs knex cli tools for migration/seeds, using the default database specified in `.env`            |
| `knex:test` | Runs knex cli tools for migration/seeds, using the test database (specified in `./test/.env.test`) |
| `postgres`  | Starts the Postgres docker container                                                               |
| `pristine`  | Runs `db:reset` then runs all the migrations and seeds on both the dev and test databases.         |
| `psql`      | Enters the psql CLI in the docker container                                                        |
| `tdd`       | Runs the tests in watch mode for a TDD workflow                                                    |
| `test`      | Runs the tests once and generates a coverage report                                                |

### Knex CLI Reference

Prepend commands below with either `yarn knex` to target the default db (specified in `.env`) or `yarn knex:test` to target the test db (specified in `./test/.env.test`).

| Command                  | Description                                                                                       |
| ------------------------ | ------------------------------------------------------------------------------------------------- |
| `migrate:latest`         | Runs all migration files in `./src/db/migrate`                                                    |
| `migrate:rollback --all` | Undos all previous migrations                                                                     |
| `seed:run`               | Runs all the seed files in `./src/db/seeds` in alphabetical order (drops all previous data first) |
| `migrate:make <name>`    | Makes an empty timestamped migration file in `./src/db/migrate`                                   |
| `seed:make <name>`       | Makes an empty seed file in `./src/db/seed`                                                       |

---

## Api Reference

1. [Setting up the local database](#setting-up-the-local-database)
2. Run `npm start`.
3. Navigate to `localhost:4000/graphql` on your browser to use the GraphQL playground (`NODE_ENV` must not be set to `production`).
4. Click `DOCS` tab on the right side to explore the API reference.
   ![](docs/graphql_playground.png)
   <br>
5. Click through the definitions to explore them in more detail:
   ![](docs/graphql_playground_detailed.png)
