import { ObjectType, Field } from "type-graphql";
import { prop } from "@typegoose/typegoose";
import { ObjectId } from "mongodb";

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
}
