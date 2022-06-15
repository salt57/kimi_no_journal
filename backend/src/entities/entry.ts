import { ObjectType, Field } from "type-graphql";
import { pre, prop, Ref, ReturnModelType } from "@typegoose/typegoose";
import { ObjectId } from "mongodb";
import bcrypt from "bcryptjs";

@pre<entry>("save", async function () {
  if (this.isNew) this.password = await bcrypt.hash(this.password, 12);
})
@ObjectType()
export class entry {
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
  content!: string;

  @prop({ ref: () => entry })
  @Field(() => ObjectId, { nullable: true })
  partner!: Ref<entry>;

  @prop({ required: true })
  password!: string;

  static async comparePasswords(
    this: ReturnModelType<typeof entry>,
    entryname: string,
    password: string
  ) {
    const entry = await this.findOne({ entryname }).exec();
    if (!entry) return false;
    return bcrypt.compare(password, entry.password);
  }
}
