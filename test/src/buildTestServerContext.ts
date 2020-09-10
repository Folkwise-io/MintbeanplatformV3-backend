import { BuildExpressServerContext, ServerContext } from "../../src/buildContext";
import { Request, Response } from "express";

const fakeReq: Request = jest.fn() as any;

const fakeRes: Response = {
  cookie: jest.fn(),
} as any;

// We must fake the req and res that normally comes from Express and is made available to resolvers, as
// req and res are undefined during testing
export const buildTestServerContext: BuildExpressServerContext = function (_expressContext) {
  return { req: fakeReq, res: fakeRes };
};
