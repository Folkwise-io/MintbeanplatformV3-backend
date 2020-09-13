import { BuildExpressServerContext, ServerContext } from "../../src/buildServerContext";

// We must fake the req and res that normally comes from Express and is made available to resolvers, as
// req and res are undefined during testing
export const buildTestServerContext: BuildExpressServerContext = function (_expressContext): ServerContext {
  return {
    //TODO: add a way to manipulate the userId from TestManager
    getUserId: jest.fn(),
    setCookie: jest.fn(),
    clearCookie: jest.fn(),
  };
};
