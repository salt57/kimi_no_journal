import { sign, verify } from "jsonwebtoken";
import { config } from "../../../config";
import { User } from "../../../entities";

export const createAccessToken = (username: string) => {
  return sign({ username }, config.jwt.accessSecret, {
    expiresIn: config.jwt.expiresIn,
  });
};

export const createRefreshToken = (user: User) => {
  return sign(
    { username: user.username, tokenVersion: user.tokenVersion },
    config.jwt.refreshSecret,
    {
      expiresIn: config.jwt.refreshExpiresIn,
    }
  );
};

export const verifyAccessToken = (token: string) => {
  const payload = verify(token, config.jwt.accessSecret);
  if (typeof payload === "string") {
    throw new Error("Invalid token");
  }
  return payload as { username: string };
};

export const verifyRefreshToken = (token: string) => {
  const payload = verify(token, config.jwt.refreshSecret);
  if (typeof payload === "string") {
    throw new Error("Invalid token");
  }
  return payload as { username: string; tokenVersion: number };
};
