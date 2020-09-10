import jwt, { SignOptions } from "jsonwebtoken";
import config from "../util/config";

const { jwtSecret } = config;

export interface JWTPayload {
  sub: string; // sub (Subject) is a registered JWT claim
}

export default function generateJwt(payload: JWTPayload): string {
  const options: SignOptions = {
    algorithm: "HS256",
    expiresIn: "2w",
  };

  const token = jwt.sign(payload, jwtSecret, options);

  return token;
}
