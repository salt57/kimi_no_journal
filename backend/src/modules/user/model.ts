import { getModelForClass } from "@typegoose/typegoose";
import { ObjectId } from "mongodb";
import { User } from "../../entities";
import { RegisterInput } from "./input";
import bcrypt from "bcryptjs";
import { Service } from "typedi";

// This generates the mongoose model for us
export const UserMongooseModel = getModelForClass(User, {
  schemaOptions: { timestamps: true },
});

@Service()
export default class UserModel {
  async getById(_id: ObjectId): Promise<User | null> {
    // Use mongoose as usual
    return UserMongooseModel.findById(_id).lean().exec();
  }

  async getByUsername(username: string): Promise<User | null> {
    // Use mongoose as usual
    return UserMongooseModel.findOne({ username }).exec();
  }

  async create(data: RegisterInput): Promise<User> {
    const user = new UserMongooseModel(data);

    return user.save();
  }
}
