import { Service } from "typedi";
import { ObjectId } from "mongodb";
import UserModel from "./model";
import { User } from "../../entities";
import { RegisterInput } from "./input";

@Service() // Dependencies injection
export default class UserService {
  constructor(private readonly userModel: UserModel) {}

  public async getById(_id: ObjectId): Promise<User | null> {
    return this.userModel.getById(_id);
  }

  public async getByUsername(username: string): Promise<User | null> {
    return this.userModel.getByUsername(username);
  }

  public async registerUser(data: RegisterInput): Promise<User> {
    const newUser = await this.userModel.create(data);

    // Business logic goes here
    // Example:
    // Trigger push notification, analytics, ...

    return newUser;
  }

  public async revokeRefreshTokensForUser(_id: ObjectId): Promise<boolean> {
    return this.userModel.revokeRefreshTokensForUser(_id);
  }

  public async sendFriendRequest(
    userId: ObjectId,
    friendId: ObjectId
  ): Promise<boolean> {
    return this.userModel.sendFriendRequest(userId, friendId);
  }

  public async acceptFriendRequest(
    userId: ObjectId,
    friendId: ObjectId
  ): Promise<boolean> {
    return this.userModel.acceptFriendRequest(userId, friendId);
  }

  public async rejectFriendRequest(
    userId: ObjectId,
    friendId: ObjectId
  ): Promise<boolean> {
    return this.userModel.rejectFriendRequest(userId, friendId);
  }

  public async choosePartner(
    userId: ObjectId,
    partnerId: ObjectId
  ): Promise<boolean> {
    return this.userModel.choosePartner(userId, partnerId);
  }

  public async switchJournal(username: string) {
    return this.userModel.switchJournal(username);
  }
}
