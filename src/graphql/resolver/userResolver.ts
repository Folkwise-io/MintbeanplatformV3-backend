import { Resolvers } from "../../types/gqlGeneratedTypes";
import { User, PublicUserDto, PrivateUserDto } from "../../types/User";
import UserService from "../../service/UserService";
import UserResolverValidator from "../../validator/UserResolverValidator";
import { ServerContext } from "../../buildServerContext";
import { ApolloError, AuthenticationError } from "apollo-server-express";
import { generateJwt } from "../../util/jwtUtils";
import { ensureExists } from "../../util/ensureExists";
import UserDao from "../../dao/UserDao";

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
// TODO: move excessive logic to validator and service layer?
const userResolver = (
  userResolverValidator: UserResolverValidator,
  userService: UserService,
  userDao: UserDao,
): Resolvers => {
  return {
    Query: {
      user: (_root, args, context: ServerContext): Promise<PublicUserDto> => {
        return userResolverValidator
          .getOne(args, context)
          .then((args) => userDao.getOne(args))
          .then((result) => {
            if (!result) throw new ApolloError("User not found");
            return mapUserToPublicUser(result);
          });
      },

      // This throws error when not logged in, but is that desired architecture?
      me: async (_root, _args, context: ServerContext): Promise<PrivateUserDto> => {
        const userId = context.getUserId();
        if (!userId) {
          throw new AuthenticationError("You are not logged in!");
        }
        const user = ensureExists<User>("User")(await userDao.getOne({ id: userId }));

        if (!user) {
          throw new AuthenticationError("Authentication failed!"); // use purposfully ambiguous wording
        }

        return mapUserToPrivateUser(user);
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
          const rawUser = ensureExists<User>("User")(await userDao.getOne({ email: args.email }));
          const privateUser = mapUserToPrivateUser(rawUser);

          const token = generateJwt(privateUser);

          context.setJwt(token);
          return { ...privateUser, token };
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
          .then(({ input }) => userService.addOne(input))
          .then(mapUserToPrivateUser)
          .then((user) => {
            const token = generateJwt(user);

            context.setJwt(token);
            return { ...user, token };
          });
      },
    },
    Project: {
      user: async (project): Promise<PublicUserDto> => {
        const rawUser = ensureExists<User>("User")(await userDao.getOne({ id: project.userId }));
        const publicUser = mapUserToPublicUser(rawUser);
        return publicUser;
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
