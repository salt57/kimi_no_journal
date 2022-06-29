import express from "express";
import cors from "cors";
import helmet from "helmet";

import { config } from "../../config";
import cookieParser from "cookie-parser";

export default (app: express.Application) => {
  // Body parser only needed during POST on the graphQL path
  app.use(config.graphqlPath, express.json());

  // Cors configuration
  app.use(cors());

  //cookie parser
  app.use(cookieParser());

  // Sets various HTTP headers to help protect our app
  if (process.env.NODE_ENV === "production") app.use(helmet());
};
