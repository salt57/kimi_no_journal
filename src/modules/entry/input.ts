import { IsMongoId, Length } from "class-validator";
import { ObjectId } from "mongodb";
import { Field, InputType } from "type-graphql";

@InputType()
export class CreateEntryInput {
  @Field()
  @Length(1, 10000)
  content!: string;
}

@InputType()
export class EditEntryInput {
  @Field()
  id!: ObjectId;

  @Field()
  @Length(1, 10000)
  content!: string;
}
