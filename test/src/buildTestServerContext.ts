import { BuildExpressServerContext, ServerContext } from "../../src/buildContext";

// We must fake the req and res that normally comes from Express and is made available to resolvers, as
// req and res are undefined during testing
export const buildTestServerContext: BuildExpressServerContext = function (_expressContext) {
  return { setCookie: jest.fn() };
};
