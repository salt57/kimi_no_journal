import { ObjectType, Field } from "type-graphql";
import { pre, prop, Ref } from "@typegoose/typegoose";
import { ObjectId } from "mongodb";
import bcrypt from "bcryptjs";

@pre<Entry>("save", async function () {
  if (this.isNew) this.password = await bcrypt.hash(this.password, 12);
})
@ObjectType()
export class Entry {
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

  @prop({ ref: () => Entry })
  @Field(() => ObjectId, { nullable: true })
  partner!: Ref<Entry>;

  @prop({ required: true })
  password!: string;
}
