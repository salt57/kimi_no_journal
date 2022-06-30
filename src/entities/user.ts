import { ObjectType, Field, Int } from "type-graphql";
import { pre, prop, Ref, ReturnModelType } from "@typegoose/typegoose";
import { ObjectId } from "mongodb";
import bcrypt from "bcryptjs";
import { Journal } from "./journal";

@pre<User>("save", async function () {
  if (this.isNew) this.password = await bcrypt.hash(this.password, 12);
})
@ObjectType()
export class User {
  @Field()
  readonly _id!: ObjectId;

  @prop()
  @Field(() => Date)
  createdAt!: Date;

  @prop()
  @Field(() => Date)
  updatedAt!: Date;

  @prop({ required: true })
  @Field()
  username!: string;

  @prop()
  @Field(() => String)
  partner!: string;

  @prop({ required: true })
  password!: string;

  @prop({ default: 0 })
  @Field(() => Int)
  tokenVersion!: number;

  @prop({ ref: () => Journal })
  @Field(() => Journal)
  journal!: Ref<Journal>;

  //friend requests
  @prop({ default: [], type: () => [String] })
  @Field(() => [String])
  friendRequests!: string[];

  @prop({ default: [], type: () => [String] })
  @Field(() => [String])
  friends!: string[];

  static async comparePasswords(
    this: ReturnModelType<typeof User>,
    username: string,
    password: string
  ) {
    const user = await this.findOne({ username }).exec();
    if (!user) return false;
    return bcrypt.compare(password, user.password);
  }
}
