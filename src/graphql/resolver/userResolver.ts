import { Resolvers, User } from "../../types/gqlGeneratedTypes";
import UserService from "../../service/UserService";
import UserResolverValidator from "../../validator/UserResolverValidator";
import { ServerContext } from "../../buildServerContext";
import { AuthenticationError } from "apollo-server-express";
import { JWTPayload, generateJwt } from "../../util/jwtUtils";

const userResolver = (userResolverValidator: UserResolverValidator, userService: UserService): Resolvers => {
  return {
    Query: {
      user: (_root, args, context: ServerContext): Promise<User> => {
        return userResolverValidator.getOne(args, context).then((args) => userService.getOne(args));
      },

      users: (_root, args, context: ServerContext): Promise<User[]> => {
        // TODO: Add validation once we need to validate params that are used for pagination / sorting etc.
        return userService.getMany(args);
      },

      me: (_root, _args, context: ServerContext): Promise<User> => {
        const userId = context.getUserId();
        if (!userId) {
          throw new AuthenticationError("You are not logged in!");
        }

        return userService.getOne({ id: userId });
      },
    },

    Mutation: {
      login: (_root, args, context: ServerContext): Promise<User> => {
        return userResolverValidator.login(args, context).then(async (args) => {
          const isValidPassword = await userService.checkPassword(args);
          if (!isValidPassword) {
            throw new AuthenticationError("Login failed!");
          }
          // TODO: Move below into jwt auth service
          // Make a JWT and return it in the body as well as the cookie
          const user = await userService.getOne({ email: args.email });
          const payload: JWTPayload = {
            sub: user.id,
          };
          const token = generateJwt(payload);

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

      register: (_root, args, context: ServerContext): Promise<User> => {
        const userId = context.getUserId();
        if (userId) {
          throw new AuthenticationError("Already logged in!");
        }

        return userResolverValidator.addOne(args).then((args) => userService.addOne(args));
      },
    },
  };
};

export default userResolver;
