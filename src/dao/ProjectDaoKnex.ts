import Knex from "knex";
import { ProjectServiceGetManyArgs, ProjectServiceGetOneArgs } from "../service/ProjectService";
import { Project } from "../types/gqlGeneratedTypes";
import ProjectDao from "./ProjectDao";

export default class ProjectDaoKnex implements ProjectDao {
  constructor(private knex: Knex) {}

  async getOne(args: ProjectServiceGetOneArgs): Promise<Project> {
    const project: Project = await this.knex("projects")
      .where({ ...args, deleted: false })
      .first();

    return project;
  }

  async getMany(args: ProjectServiceGetManyArgs): Promise<Project[]> {
    const projects: Project[] = await this.knex("projects")
      .where({ ...args, deleted: false })
      .orderBy("createdAt", "desc");

    return projects;
  }

  addOne(args: any): Promise<Project> {
    throw new Error("Method not implemented.");
  }

  editOne(id: string, input: any): Promise<Project> {
    throw new Error("Method not implemented.");
  }

  deleteOne(id: string): Promise<boolean> {
    throw new Error("Method not implemented.");
  }

  // Testing methods below, for TestManager to call
  async addMany(projects: Project[]): Promise<void> {
    return this.knex<Project>("projects").insert(projects);
  }

  deleteAll(): Promise<void> {
    return this.knex<Project>("projects").delete();
  }
}
