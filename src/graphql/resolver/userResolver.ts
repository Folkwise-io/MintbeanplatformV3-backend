import { Resolvers } from "../../types/gqlGeneratedTypes";
import { User, PublicUserDto, PrivateUserDto } from "../../types/User";
import UserService from "../../service/UserService";
import UserResolverValidator from "../../validator/UserResolverValidator";
import { ServerContext } from "../../buildServerContext";
import { AuthenticationError } from "apollo-server-express";
import { generateJwt } from "../../util/jwtUtils";

const mapUserToPublicUser = ({ id, firstName, lastName, isAdmin, createdAt, updatedAt }: User): PublicUserDto => ({
  id,
  firstName,
  lastName,
  isAdmin,
  createdAt,
  updatedAt,
});

const mapUserToPrivateUser = ({
  id,
  firstName,
  lastName,
  isAdmin,
  createdAt,
  updatedAt,
  email,
}: User): PrivateUserDto => ({
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
      user: (_root, args, context: ServerContext): Promise<PublicUserDto> => {
        return userResolverValidator
          .getOne(args, context)
          .then((args) => userService.getOne(args))
          .then(mapUserToPublicUser);
      },

      me: (_root, _args, context: ServerContext): Promise<PrivateUserDto> => {
        const userId = context.getUserId();
        if (!userId) {
          throw new AuthenticationError("You are not logged in!");
        }

        return userService.getOne({ id: userId }).then(mapUserToPrivateUser);
      },
    },

    Mutation: {
      login: (_root, args, context: ServerContext): Promise<PrivateUserDto> => {
        return userResolverValidator.login(args, context).then(async (args) => {
          const isValidPassword = await userService.checkPassword(args);
          if (!isValidPassword) {
            throw new AuthenticationError("Login failed!");
          }
          // TODO: Move below into jwt auth service
          // Make a JWT and return it in the body as well as the cookie
          const user = await userService.getOne({ email: args.email }).then(mapUserToPrivateUser);
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

      register: (_root, args, context: ServerContext): Promise<PrivateUserDto> => {
        const userId = context.getUserId();
        if (userId) {
          throw new AuthenticationError("Already logged in!");
        }

        return userResolverValidator
          .addOne(args)
          .then((input) => userService.addOne(input))
          .then(mapUserToPrivateUser)
          .then((user) => {
            const token = generateJwt(user);

            context.setJwt(token);
            return { ...user, token };
          });
      },
    },
    Project: {
      user: (project): Promise<PublicUserDto> => {
        return userService.getOne({ id: project.userId }).then(mapUserToPublicUser);
      },
    },
    Meet: {
      registrants: (meet): Promise<User[]> => {
        return userService.getRegistrantsOfMeet(meet.id);
      },
    },
  };
};

export default userResolver;
