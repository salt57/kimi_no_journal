import { getModelForClass } from "@typegoose/typegoose";
import { ObjectId } from "mongodb";
import { User } from "../../entities";
import { RegisterInput } from "./input";
import { Service } from "typedi";
import JournalModel from "../journal/model";
import { Journal } from "../../entities/journal";

// This generates the mongoose model for us
export const UserMongooseModel = getModelForClass(User, {
  schemaOptions: { timestamps: true },
});

@Service()
export default class UserModel {
  constructor(private readonly journalModel: JournalModel) {}

  async getById(_id: ObjectId): Promise<User | null> {
    // Use mongoose as usual
    return UserMongooseModel.findById(_id).lean().exec();
  }

  async getByUsername(username: string): Promise<User | null> {
    // Use mongoose as usual
    return UserMongooseModel.findOne({ username }).populate(["journal"]).exec();
  }

  async create(data: RegisterInput): Promise<User> {
    const journal = await this.journalModel.create({
      title: data.journalTitle,
    });
    const user = new UserMongooseModel({
      username: data.username,
      password: data.password,
      journal: journal._id,
    });

    return user.save();
  }

  async revokeRefreshTokensForUser(_id: ObjectId): Promise<boolean> {
    const user = await UserMongooseModel.findById(_id);
    if (!user) return Promise.resolve(false);
    user.tokenVersion += 1;
    await user.save();
    return Promise.resolve(true);
  }

  async sendFriendRequest(
    userId: ObjectId,
    friendId: ObjectId
  ): Promise<boolean> {
    const user = await UserMongooseModel.findById(userId);
    if (!user) return Promise.resolve(false);
    const friend = await UserMongooseModel.findById(friendId);
    if (!friend) return Promise.resolve(false);
    if (friend.friendRequests.includes(user.username))
      throw new Error("You have already sent a friend request to this user");
    friend.friendRequests.push(user.username);
    await friend.save();
    return Promise.resolve(true);
  }

  async acceptFriendRequest(
    userId: ObjectId,
    friendId: ObjectId
  ): Promise<boolean> {
    const user = await UserMongooseModel.findById(userId);
    if (!user) return Promise.resolve(false);
    const friend = await UserMongooseModel.findById(friendId);
    if (!friend) return Promise.resolve(false);
    if (!user.friendRequests.includes(friend.username))
      throw new Error("You have not sent a friend request to this user");
    friend.friends.push(user.username);
    user.friends.push(friend.username);
    user.friendRequests = user.friendRequests.filter(
      (username) => username !== friend.username
    );
    await friend.save();
    await user.save();
    return Promise.resolve(true);
  }

  async rejectFriendRequest(
    userId: ObjectId,
    friendId: ObjectId
  ): Promise<boolean> {
    const user = await UserMongooseModel.findById(userId);
    if (!user) return Promise.resolve(false);
    const friend = await UserMongooseModel.findById(friendId);
    if (!friend) return Promise.resolve(false);
    if (!user.friendRequests.includes(friend.username))
      throw new Error("You have not sent a friend request to this user");
    user.friendRequests = user.friendRequests.filter(
      (username) => username !== friend.username
    );
    await user.save();
    return Promise.resolve(true);
  }

  async choosePartner(userId: ObjectId, partnerId: ObjectId): Promise<boolean> {
    const user = await UserMongooseModel.findById(userId);
    if (!user) return Promise.resolve(false);
    const partner = await UserMongooseModel.findById(partnerId);
    if (!partner) return Promise.resolve(false);
    if (
      !partner.friends.includes(user.username) ||
      !user.friends.includes(partner.username)
    )
      throw new Error("You are not friends with this user");
    partner.partner = user.username;
    user.partner = partner.username;
    await partner.save();
    await user.save();
    return Promise.resolve(true);
  }

  async switchJournal(username: string): Promise<Journal> {
    const user = await UserMongooseModel.findOne({ username }).populate(
      "journal"
    );
    if (!user) throw new Error("User not found");
    const partner = await UserMongooseModel.findOne({
      username: user.partner,
    }).populate("journal");
    if (!partner) throw new Error("Partner not found");
    [partner.journal, user.journal] = [user.journal, partner.journal];
    await partner.save();
    await user.save();
    return user.journal as Journal;
  }
}
