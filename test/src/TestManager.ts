import { createTestClient } from "apollo-server-testing";
import server from "../../src/server";
import { Query } from "./createTestClient";
const { query, mutate } = createTestClient(server);

export default class TestManager {
  async query(args: Query) {
    return await query(args);
  }
}
