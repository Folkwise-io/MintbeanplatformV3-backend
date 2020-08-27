# Mintbean Platform V3 Backend

<!-- @import "[TOC]" {cmd="toc" depthFrom=2 depthTo=6 orderedList=false} -->

<!-- code_chunk_output -->

- [Installation](#installation)
- [Development](#development)
  - [Setting up the local database](#setting-up-the-local-database)
  - [Developing](#developing)
    - [Auto-generating TypeScript types](#auto-generating-typescript-types)
    - [Adding new schemas](#adding-new-schemas)
    - [Script Reference](#script-reference)
  - [Running tests](#running-tests)

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

3. Set up the schema migrations with `yarn knex migrate:latest`.

4. Set up the seeds with `yarn knex seed:run`

Roll back all migrations with `yarn knex migrate:rollback --all`.

Access the PostgreSQL CLI with `yarn psql`. All column names that are in camelCase need double quotation marks when used in raw SQL queries (i.e. `SELECT body, "userId" from posts;`).

### Developing

1. [Setting up the local database](#setting-up-the-local-database)
2. Run `yarn dev` to start a GraphQL endpoint at `localhost:4000/graphql`.
3. Go to `localhost:4000/graphql` to use the GraphQL Playground.

#### Auto-generating TypeScript types

Running `yarn gen-types` auto-generates a TypeScript definition file using `graphql-codegen`. The tool reads the schema file in `./src/graphql/schema.ts` and outputs TypeScript definitions in `./src/graphql/generated/tsTypes.d.ts`. You may then import types directly from that file, such as:

```ts
import { User } from "./generated/tsTypes";
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

Remember to run `yarn gen-types` after every schema change, to ensure `tsTypes` is up to date.

#### Adding new schemas

1. Create the new typeDef file for the entity in `./src/graphql/typedefs/entity.ts`.
2. Run `yarn gen-types` to update the `Resolvers` type in Typescript type so you can take advantage of typing when making the resolver.
3. Create a new resolver file for the entity in `./src/graphql/resolvers/entityResolver.ts`.
4. Add the typedef and resolver into the corresponding array of the schema generator file in `./src/graphql/schema.ts`.

#### Script Reference

| Script      | Description                                    |
| ----------- | ---------------------------------------------- |
| `start`     | Starts the server with `ts-node`               |
| `dev`       | Starts the server with `ts-node` & hot-reload  |
| `build`     | Builds .ts in `./src` to .js in `./build`      |
| `gen-types` | See [above](#auto-generating-typescript-types) |
| `knex`      | Runs knex cli tools for migration/seeds        |
| `postgres`  | Starts the Postgres docker container           |
| `psql`      | Enters the psql CLI in the docker container    |

### Running tests

1. [Setting up the local database](#setting-up-the-local-database)

2. TODO
