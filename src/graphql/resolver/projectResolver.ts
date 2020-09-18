import { ServerContext } from "../../buildServerContext";
import ProjectService from "../../service/ProjectService";
import { Project, Resolvers } from "../../types/gqlGeneratedTypes";
import ProjectResolverValidator from "../../validator/ProjectResolverValidator";

const projectResolver = (
  projectResolverValidator: ProjectResolverValidator,
  projectService: ProjectService,
): Resolvers => {
  return {
    Query: {
      // TODO: Show "deleted=true" projects for admin? Currently this query does not get Projects with "deleted=true"
      project: (_root, args, context: ServerContext): Promise<Project> => {
        return projectResolverValidator.getOne(args, context).then((args) => projectService.getOne(args, context));
      },
    },
    User: {
      projects: (user, context) => {
        return projectService.getMany({ userId: user.id }, context);
      },
    },
  };
};

export default projectResolver;
