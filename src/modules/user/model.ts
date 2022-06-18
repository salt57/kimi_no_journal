import { getModelForClass } from "@typegoose/typegoose";
import { ObjectId } from "mongodb";
import { User } from "../../entities";
import { RegisterInput } from "./input";
import { Service } from "typedi";
import JournalModel from "../journal/model";

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
    return UserMongooseModel.findOne({ username }).populate("journal").exec();
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
}
