// May use in the future in place of real db if Knex/Postgres gets too slow
import { User } from "../../../src/graphql/generated/tsTypes";

export interface TestState {
  users: User[];
}
