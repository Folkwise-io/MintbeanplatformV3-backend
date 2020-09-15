import { AuthenticationError } from "apollo-server-express";
import { Request, Response } from "express";
import { setCookie, clearCookie } from "./util/cookieUtils";
import { parseJwt } from "./util/jwtUtils";

export interface ExpressContext {
  req: Request;
  res: Response;
}

export interface ServerContext {
  getUserId(): string;
  setJwt(token: string): void;
  clearJwt(): void;
  // TODO: include userId and maybe auth scope, which will be parsed from req cookie
}

export type BuildExpressServerContext = (expressContext: ExpressContext) => ServerContext;

export const buildExpressServerContext: BuildExpressServerContext = function ({
  req,
  res,
}: {
  req: Request;
  res: Response;
}): ServerContext {
  // TODO: Clean up later
  let userId: string;
  const jwt: string = req.cookies.jwt;

  if (jwt) {
    try {
      const parsedToken = parseJwt(jwt);
      userId = parsedToken.sub;
    } catch (e) {
      // parseJwt throws an error in case of signature mismatch or jwt is expired
      res.clearCookie("jwt"); // We need to do this otherwise it will be an infinite loop
      throw new AuthenticationError(e.message);
    }
  }

  return {
    getUserId: () => userId,
    setJwt: setCookie(res),
    clearJwt: clearCookie(res),
  };
};
