import jwt, { SignOptions } from "jsonwebtoken";
import { User } from "../types/gqlGeneratedTypes";
import config from "./config";

const { jwtSecret } = config;

export interface JWTPayload {
  sub: string; // sub (Subject) is a registered JWT claim
}

export interface ParsedToken {
  sub: string;
  iat: number;
  exp: number;
}

export function generateJwt(user: User): string {
  const payload: JWTPayload = {
    sub: user.id,
  };

  const options: SignOptions = {
    algorithm: "HS256",
    expiresIn: "2w",
  };

  const token = jwt.sign(payload, jwtSecret, options);

  return token;
}

/**
 * Parses a token, with jwt.verify throwing an error if the token is invalid
 * @param token The base64-encoded, signed token
 */
export function parseJwt(token: string): ParsedToken {
  const parsedToken = jwt.verify(token, jwtSecret) as ParsedToken;
  return parsedToken;
}
