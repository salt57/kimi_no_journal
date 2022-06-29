import dotenv from "dotenv";
dotenv.config();

// Safely get the environment variable in the process
const env = (name: string): string => {
  const value = process.env[name];

  if (!value) {
    throw new Error(`Missing: process.env['${name}'].`);
  }

  return value;
};

export interface Config {
  port: number;
  graphqlPath: string;
  isDev: boolean;
  mongoDB: {
    uri: string;
  };
  redis: {
    host: string;
    port: number;
  };
  jwt: {
    accessSecret: string;
    refreshSecret: string;
    expiresIn: string;
    refreshExpiresIn: string;
  };
}

// All your secrets, keys go here
export const config: Config = {
  port: +env("PORT"),
  graphqlPath: env("GRAPHQL_PATH"),
  isDev: env("NODE_ENV") === "development",
  mongoDB: {
    uri: env("MONGODB_URI"),
  },
  redis: {
    port: +env("REDIS_PORT"),
    host: env("REDIS_HOST"),
  },
  jwt: {
    accessSecret: env("JWT_SECRET"),
    refreshSecret: env("JWT_REFRESH_SECRET"),
    expiresIn: env("JWT_EXPIRES_IN"),
    refreshExpiresIn: env("JWT_REFRESH_EXPIRES_IN"),
  },
};
