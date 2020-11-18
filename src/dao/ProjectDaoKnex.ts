import Knex from "knex";
import {
  ProjectServiceAddOneInput,
  ProjectServiceGetManyArgs,
  ProjectServiceGetOneArgs,
} from "../service/ProjectService";
import { MutationAwardBadgesArgs, Project } from "../types/gqlGeneratedTypes";
import handleDatabaseError from "../util/handleDatabaseError";
import ProjectDao from "./ProjectDao";

export default class ProjectDaoKnex implements ProjectDao {
  constructor(private knex: Knex) {}

  async getOne(args: ProjectServiceGetOneArgs): Promise<Project> {
    const { id } = args;
    return handleDatabaseError(async () => {
      const project: Project = await this.knex("projects as p")
        .select("p.*")
        .leftJoin("badgesProjects as bp", "p.id", "=", "bp.projectId")
        .where({ "p.id": id, deleted: false })
        .distinct()
        .first()
        .options({ nestTables: true });
      return project;
    });
  }

  async getMany(args: ProjectServiceGetManyArgs): Promise<Project[]> {
    return handleDatabaseError(async () => {
      const projects: Project[] = await this.knex("projects as p")
        .select("p.*")
        .leftJoin("badgesProjects as bp", "p.id", "=", "bp.projectId")
        .where({ ...args, deleted: false })
        .distinct()
        .orderBy("p.createdAt", "desc")
        .options({ nestTables: true });
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

  // Testing methods below, for TestManager to call
  async addMany(projects: Project[]): Promise<void> {
    return this.knex<Project>("projects").insert(projects);
  }

  deleteAll(): Promise<void> {
    return this.knex<Project>("projects").delete();
  }
}
