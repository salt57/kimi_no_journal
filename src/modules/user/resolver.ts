import { Resolver, Arg, Query, Mutation } from "type-graphql";
import { Service } from "typedi";
import { ObjectId } from "mongodb";

import { User } from "../../entities";
import UserService from "./service";
import { LoginInput, RegisterInput } from "./input";
import { UserMongooseModel } from "./model";

/*
  IMPORTANT: Your business logic must be in the service!
*/

@Service() // Dependencies injection
@Resolver(() => User)
export default class UserResolver {
  constructor(private readonly userService: UserService) {}

  @Query(() => User)
  async getUser(@Arg("id") id: ObjectId) {
    const user = await this.userService.getById(id);

    return user;
  }

  @Mutation(() => User)
  async createUser(
    @Arg("createUserData") createUserData: RegisterInput
  ): Promise<User> {
    const user = await this.userService.registerUser(createUserData);
    return user;
  }

  @Mutation(() => User, { nullable: true })
  async loginUser(
    @Arg("loginUserData") loginUserData: LoginInput
  ): Promise<User | null> {
    if (
      !(await UserMongooseModel.comparePasswords(
        loginUserData.username,
        loginUserData.password
      ))
    ) {
      return new Promise((resolve) => resolve(null));
    }
    return this.userService.getByUsername(loginUserData.username);
  }
}
