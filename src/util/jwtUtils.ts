import jwt, { SignOptions } from "jsonwebtoken";
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

export function generateJwt(payload: JWTPayload): string {
  const options: SignOptions = {
    algorithm: "HS256",
    expiresIn: "2w",
  };

  const token = jwt.sign(payload, jwtSecret, options);

  return token;
}

export function parseJwt(token: string): string | undefined {
  try {
    const parsedToken = jwt.verify(token, jwtSecret) as ParsedToken;
    return parsedToken.sub;
  } catch (e) {
    return undefined;
  }
}
