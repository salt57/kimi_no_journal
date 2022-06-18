import { ObjectType, Field } from "type-graphql";
import { prop } from "@typegoose/typegoose";
import { ObjectId } from "mongodb";
import { Entry } from "./entry";

@ObjectType()
export class Journal {
  @Field()
  readonly _id!: ObjectId;

  @prop({ required: true })
  @Field()
  title!: string;

  @prop()
  @Field(() => Date)
  createdAt!: Date;

  @prop()
  @Field(() => Date)
  updatedAt!: Date;

  @prop({ type: Entry, required: true, default: [] })
  @Field(() => [Entry])
  entries!: Entry[];
}
