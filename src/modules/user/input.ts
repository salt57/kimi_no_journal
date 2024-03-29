import { Length } from "class-validator";
import { ObjectId } from "mongodb";
import { Field, InputType } from "type-graphql";
import { IsUsernameAlreadyExist } from "./helpers/isUsernameAlreadyExist";

@InputType()
export class RegisterInput {
  @Field()
  @Length(1, 255)
  @IsUsernameAlreadyExist({ message: "email already in use" })
  username!: string;

  @Field()
  @Length(6, 100)
  //contains atleast one number, one uppercase letter, one lowercase letter and one special character
  password!: string;

  @Field()
  @Length(4, 40)
  journalTitle!: string;

  @Field(() => ObjectId, { nullable: true })
  partner?: ObjectId;
}

@InputType()
export class LoginInput {
  @Field()
  @Length(1, 255)
  username!: string;

  @Field()
  @Length(6, 100)
  password!: string;
}

@InputType()
export class FriendRequestInput {
  @Field()
  @Length(1, 255)
  username!: string;
}
