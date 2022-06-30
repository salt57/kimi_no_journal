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
import {
  createAccessToken,
  createRefreshToken,
  verifyRefreshToken,
} from "./helpers/jwtTokens";
import { isAuth } from "../../middlewares/isAuth";
import { Journal } from "../../entities/journal";

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

  @UseMiddleware(isAuth)
  @Mutation(() => Boolean)
  async revokeRefreshTokensForUser(
    @Ctx() { payload }: ContextType
  ): Promise<boolean> {
    if (!payload) {
      throw new Error("You are not logged in");
    }
    const user = await this.userService.getByUsername(payload.username);
    if (!user) {
      throw new Error("User not found");
    }
    return this.userService.revokeRefreshTokensForUser(user._id);
  }

  @Mutation(() => LoginResponse)
  async regenAccessToken(
    @Ctx() { req, res }: ContextType
  ): Promise<LoginResponse> {
    const jid = (req.cookies as { jid: string }).jid;
    if (!jid) {
      throw new Error("No refresh token cookie");
    }
    const { username, tokenVersion } = verifyRefreshToken(jid);
    const user = await this.userService.getByUsername(username);
    if (!user) {
      throw new Error("User not found");
    }
    if (user.tokenVersion !== tokenVersion) {
      throw new Error("Refresh token is invalid");
    }
    res.cookie("jid", createRefreshToken(user), { httpOnly: true });
    return {
      accessToken: createAccessToken(username),
    };
  }

  //send friend request
  @UseMiddleware(isAuth)
  @Mutation(() => Boolean)
  async sendFriendRequest(
    @Arg("username") username: string,
    @Ctx() { payload }: ContextType
  ): Promise<boolean> {
    if (!payload) {
      throw new Error("You are not logged in");
    }
    const user = await this.userService.getByUsername(payload.username);
    if (!user) {
      throw new Error("User not found");
    }
    const friend = await this.userService.getByUsername(username);
    if (!friend) {
      throw new Error("User to send request to not found");
    }
    return this.userService.sendFriendRequest(user._id, friend._id);
  }

  //accept friend request
  @UseMiddleware(isAuth)
  @Mutation(() => Boolean)
  async acceptFriendRequest(
    @Arg("username") username: string,
    @Ctx() { payload }: ContextType
  ): Promise<boolean> {
    if (!payload) {
      throw new Error("You are not logged in");
    }
    const user = await this.userService.getByUsername(payload.username);
    if (!user) {
      throw new Error("User not found");
    }
    const friend = await this.userService.getByUsername(username);
    if (!friend) {
      throw new Error("User to send request to not found");
    }
    return this.userService.acceptFriendRequest(user._id, friend._id);
  }

  @UseMiddleware(isAuth)
  @Mutation(() => Boolean)
  async rejectFriendRequest(
    @Arg("username") username: string,
    @Ctx() { payload }: ContextType
  ): Promise<boolean> {
    if (!payload) {
      throw new Error("You are not logged in");
    }
    const user = await this.userService.getByUsername(payload.username);
    if (!user) {
      throw new Error("User not found");
    }
    const friend = await this.userService.getByUsername(username);
    if (!friend) {
      throw new Error("User to send request to not found");
    }
    return this.userService.rejectFriendRequest(user._id, friend._id);
  }

  // choose partner
  @UseMiddleware(isAuth)
  @Mutation(() => Boolean)
  async choosePartner(
    @Arg("username") username: string,
    @Ctx() { payload }: ContextType
  ): Promise<boolean> {
    if (!payload) {
      throw new Error("You are not logged in");
    }
    const user = await this.userService.getByUsername(payload.username);
    if (!user) {
      throw new Error("User not found");
    }
    const friend = await this.userService.getByUsername(username);
    if (!friend) {
      throw new Error("User to send request to not found");
    }
    if (
      !user.friends.includes(friend.username) ||
      !friend.friends.includes(user.username)
    ) {
      throw new Error("You are not friends");
    }
    return this.userService.choosePartner(user._id, friend._id);
  }

  //switch journals
  @UseMiddleware(isAuth)
  @Mutation(() => Journal)
  async switchJournal(@Ctx() { payload }: ContextType): Promise<Journal> {
    if (!payload) {
      throw new Error("You are not logged in");
    }
    return this.userService.switchJournal(payload.username);
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
    const user = await this.userService.getByUsername(loginUserData.username);
    if (!user) {
      throw new Error("User not found");
    }
    res.cookie("jid", createRefreshToken(user), {
      httpOnly: true,
    });
    return {
      accessToken: createAccessToken(loginUserData.username),
    };
  }
}
