import Knex from "knex";
import { Project } from "../types/gqlGeneratedTypes";
import handleDatabaseError from "../util/handleDatabaseError";
import ProjectDao, { ProjectDaoAddOneInput, ProjectDaoGetManyArgs, ProjectDaoGetOneArgs } from "./ProjectDao";

export default class ProjectDaoKnex implements ProjectDao {
  knex: Knex;
  constructor(knex: Knex) {
    this.knex = knex;
  }

  async getOne(args: ProjectDaoGetOneArgs): Promise<Project | undefined> {
    const { id } = args;
    return handleDatabaseError(async () => {
      const project: Project = await this.knex("projects")
        .select("projects.*")
        .leftJoin("badgesProjects", "projects.id", "=", "badgesProjects.projectId")
        .where({ "projects.id": id, deleted: false })
        .first();
      return project;
    });
  }

  async getMany(args: ProjectDaoGetManyArgs): Promise<Project[]> {
    return handleDatabaseError(async () => {
      const projects: Project[] = await this.knex("projects")
        .select("projects.*")
        .leftJoin("badgesProjects", "projects.id", "=", "badgesProjects.projectId")
        .where({ ...args, deleted: false })
        .groupBy("projects.id")
        .orderBy("projects.createdAt", "desc");
      return projects;
    });
  }

  async addOne(input: ProjectDaoAddOneInput): Promise<Project> {
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
