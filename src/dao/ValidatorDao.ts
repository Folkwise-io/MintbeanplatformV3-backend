import Knex from "knex";

export default class ValidatorDao {
  constructor(private knex: Knex) {}

  async doesUserExist(id: string): Promise<boolean> {
    const user = await this.knex("users").where({ id }).first();
    return Boolean(user);
  }
}
