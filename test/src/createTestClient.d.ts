import { DocumentNode } from "graphql";
type StringOrAst = string | DocumentNode;

export type Query = {
  query: StringOrAst;
  mutation?: undefined;
  variables?: {
    [name: string]: any;
  };
  operationName?: string;
};

export type Mutation = {
  mutation: StringOrAst;
  query?: undefined;
  variables?: {
    [name: string]: any;
  };
  operationName?: string;
};
