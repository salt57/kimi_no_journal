import {
  Resolver,
  Arg,
  Query,
  Mutation,
  Ctx,
  UseMiddleware,
} from "type-graphql";
import { Service } from "typedi";

import { User } from "../../entities";
import UserService from "./service";
import { LoginInput, RegisterInput } from "./input";
import { UserMongooseModel } from "./model";
import { LoginResponse } from "./output";
import { ContextType } from "../../bootstrap/loaders/apollo";
import { createAccessToken, createRefreshToken } from "./helpers/jwtTokens";
import { isAuth } from "../../middlewares/isAuth";

/*
  IMPORTANT: Your business logic must be in the service!
*/

@Service() // Dependencies injection
@Resolver(() => User)
export default class UserResolver {
  constructor(private readonly userService: UserService) {}

  @UseMiddleware(isAuth)
  @Query(() => User)
  async getUser(@Ctx() { payload }: ContextType): Promise<User | null> {
    if (!payload) {
      throw new Error("You are not logged in");
    }
    const user = await this.userService.getByUsername(payload.username);

    return user;
  }

  @Mutation(() => User)
  async createUser(
    @Arg("createUserData") createUserData: RegisterInput
  ): Promise<User> {
    const user = await this.userService.registerUser(createUserData);
    return user;
  }

  @Mutation(() => LoginResponse, { nullable: true })
  async loginUser(
    @Arg("loginUserData") loginUserData: LoginInput,
    @Ctx() { res }: ContextType
  ): Promise<LoginResponse | null> {
    if (
      !(await UserMongooseModel.comparePasswords(
        loginUserData.username,
        loginUserData.password
      ))
    ) {
      throw new Error("Invalid username or password");
    }
    res.cookie("jid", createRefreshToken(loginUserData.username), {
      httpOnly: true,
    });
    return {
      accessToken: createAccessToken(loginUserData.username),
    };
  }
}
