import { ApolloServer } from "apollo-server-express";
import {
  ApolloServerPluginLandingPageDisabled,
  ApolloServerPluginLandingPageGraphQLPlayground,
} from "apollo-server-core";

import { buildSchema } from "../../utils";
import { Request, Response } from "express";

export interface ContextType {
  req: Request;
  res: Response;
  payload?: { username: string };
}

export default async () => {
  const schema = await buildSchema();

  return new ApolloServer({
    schema,
    plugins: [
      process.env.NODE_ENV === "production"
        ? ApolloServerPluginLandingPageDisabled()
        : ApolloServerPluginLandingPageGraphQLPlayground(),
    ],
    context: ({ req, res }) => ({ req, res }),
  });
};
