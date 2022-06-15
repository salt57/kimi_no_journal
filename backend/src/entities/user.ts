import { ObjectType, Field } from "type-graphql";
import { pre, prop, Ref, ReturnModelType } from "@typegoose/typegoose";
import { ObjectId } from "mongodb";
import bcrypt from "bcryptjs";

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

  @prop({ ref: () => User })
  @Field(() => ObjectId, { nullable: true })
  partner!: Ref<User>;

  @prop({ required: true })
  password!: string;

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