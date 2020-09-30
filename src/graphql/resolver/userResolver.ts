import { Resolvers } from "../../types/gqlGeneratedTypes";
import { User, PublicUser, PrivateUser } from "../../types/user";
import UserService from "../../service/UserService";
import UserResolverValidator from "../../validator/UserResolverValidator";
import { ServerContext } from "../../buildServerContext";
import { AuthenticationError } from "apollo-server-express";
import { generateJwt } from "../../util/jwtUtils";

const extractPublicFields = ({ id, firstName, lastName, isAdmin, createdAt, updatedAt }: User): PublicUser => ({
  id,
  firstName,
  lastName,
  isAdmin,
  createdAt,
  updatedAt,
});

const extractPrivateFields = ({
  id,
  firstName,
  lastName,
  isAdmin,
  createdAt,
  updatedAt,
  email,
}: User): PrivateUser => ({
  id,
  firstName,
  lastName,
  isAdmin,
  createdAt,
  updatedAt,
  email,
});

const userResolver = (userResolverValidator: UserResolverValidator, userService: UserService): Resolvers => {
  return {
    Query: {
      user: (_root, args, context: ServerContext): Promise<PublicUser> => {
        return userResolverValidator
          .getOne(args, context)
          .then((args) => userService.getOne(args))
          .then(extractPublicFields);
      },

      me: (_root, _args, context: ServerContext): Promise<PrivateUser> => {
        const userId = context.getUserId();
        if (!userId) {
          throw new AuthenticationError("You are not logged in!");
        }

        return userService.getOne({ id: userId }).then(extractPrivateFields);
      },
    },

    Mutation: {
      login: (_root, args, context: ServerContext): Promise<PrivateUser> => {
        return userResolverValidator.login(args, context).then(async (args) => {
          const isValidPassword = await userService.checkPassword(args);
          if (!isValidPassword) {
            throw new AuthenticationError("Login failed!");
          }
          // TODO: Move below into jwt auth service
          // Make a JWT and return it in the body as well as the cookie
          const user = await userService.getOne({ email: args.email }).then(extractPrivateFields);
          const token = generateJwt(user);

          context.setJwt(token);
          return { ...user, token };
        });
      },

      logout: (_root, _args, context: ServerContext): boolean => {
        const userId = context.getUserId();
        if (userId) {
          context.clearJwt();
          return true;
        }
        return false;
      },

      register: (_root, args, context: ServerContext): Promise<PrivateUser> => {
        const userId = context.getUserId();
        if (userId) {
          throw new AuthenticationError("Already logged in!");
        }

        return userResolverValidator
          .addOne(args)
          .then((input) => userService.addOne(input))
          .then(extractPrivateFields)
          .then((user) => {
            const token = generateJwt(user);

            context.setJwt(token);
            return { ...user, token };
          });
      },
    },
    Project: {
      user: (project): Promise<PublicUser> => {
        return userService.getOne({ id: project.userId }).then(extractPublicFields);
      },
    },
  };
};

export default userResolver;
