import Knex from "knex";
import ProjectDaoKnex from "../../../src/dao/ProjectDaoKnex";
import { Project } from "../../../src/types/gqlGeneratedTypes";

export default class TestProjectDaoKnex extends ProjectDaoKnex {
  constructor(knex: Knex) {
    super(knex);
  }

  // Testing methods below, for TestManager to call
  async addMany(projects: Project[]): Promise<void> {
    return this.knex<Project>("projects").insert(projects);
  }

  async deleteAll(): Promise<void> {
    return this.knex<Project>("projects").delete();
  }
}
