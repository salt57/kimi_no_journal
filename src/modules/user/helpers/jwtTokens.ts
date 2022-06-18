import { sign, verify } from "jsonwebtoken";
import { config } from "../../../config";

export const createAccessToken = (username: string) => {
  return sign({ username }, config.jwt.secret, {
    expiresIn: config.jwt.expiresIn,
  });
};

export const createRefreshToken = (username: string) => {
  return sign({ username }, config.jwt.secret, {
    expiresIn: config.jwt.refreshExpiresIn,
  });
};

export const verifyAccessToken = (token: string) => {
  const payload = verify(token, config.jwt.secret);
  if (typeof payload === "string") {
    throw new Error("Invalid token");
  }
  return payload as { username: string };
};
