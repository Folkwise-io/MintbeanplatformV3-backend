import { Response, CookieOptions } from "express";

const cookieOptions: CookieOptions = {
  maxAge: 14 * 24 * 60 * 60 * 1000, // 14 days
  httpOnly: true,
  sameSite: "strict", // May need to change if frontend & backend are hosted on different servers
};

export const setCookie = (res: Response) => (token: string): void => {
  res.cookie("jwt", token, cookieOptions);
};
const b = 2
const a = setCookie(b as any)