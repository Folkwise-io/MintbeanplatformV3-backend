import Knex from "knex";
import {
  ProjectServiceAddOneInput,
  ProjectServiceGetManyArgs,
  ProjectServiceGetOneArgs,
} from "../service/ProjectService";
import { Project } from "../types/gqlGeneratedTypes";
import { ensureExists } from "../util/ensureExists";
import handleDatabaseError from "../util/handleDatabaseError";
import ProjectDao from "./ProjectDao";

export default class ProjectDaoKnex implements ProjectDao {
  knex: Knex;
  constructor(knex: Knex) {
    this.knex = knex;
  }

  async getOne(args: ProjectServiceGetOneArgs): Promise<Project | undefined> {
    return handleDatabaseError(async () => {
      const project: Project = await this.knex("projects")
        .where({ ...args, deleted: false })
        .first();
      return project;
    });
  }

  async getMany(args: ProjectServiceGetManyArgs): Promise<Project[]> {
    return handleDatabaseError(async () => {
      const projects: Project[] = await this.knex("projects")
        .where({ ...args, deleted: false })
        .orderBy("createdAt", "desc");

      return projects;
    });
  }

  async addOne(input: ProjectServiceAddOneInput): Promise<Project> {
    return handleDatabaseError(async () => {
      const newProjects = (await this.knex("projects").insert(input).returning("*")) as Project[];
      return newProjects[0];
    });
  }

  editOne(id: string, input: any): Promise<Project> {
    throw new Error("Method not implemented.");
  }

  async deleteOne(id: string): Promise<boolean> {
    return handleDatabaseError(async () => {
      await this.knex("projects").where({ id }).update({ deleted: true });
      return true;
    });
  }
}
