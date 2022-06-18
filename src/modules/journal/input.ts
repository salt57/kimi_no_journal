import { Length } from "class-validator";
import { InputType, Field } from "type-graphql";

@InputType()
export class EditJournalInput {
  @Field()
  @Length(1, 10000)
  title!: string;
}
