import { MiddlewareFn } from "type-graphql";
import { ContextType } from "../bootstrap/loaders/apollo";
import { verifyAccessToken } from "../modules/user/helpers/jwtTokens";

export const isAuth: MiddlewareFn<ContextType> = ({ context }, next) => {
  const bearerToken = context.req.headers.authorization;
  if (!bearerToken) {
    throw new Error("Not authenticated");
  }
  const accessToken = bearerToken.split(" ")[1];
  const payload = verifyAccessToken(accessToken);
  context.payload = payload;

  return next();
};
