import { Container } from "typedi";
import { ObjectId } from "mongodb";
import { buildSchema as typeGraphqlBuildSchema } from "type-graphql";

import { ObjectIdScalar } from "./";
import UserResolver from "../modules/user/resolver";
import JournalResolver from "../modules/journal/resolver";

// Here goes your schema building bit, doing it this way allows us to use it in the tests as well!
export const buildSchema = () =>
  typeGraphqlBuildSchema({
    resolvers: [UserResolver, JournalResolver],
    container: Container,
    scalarsMap: [{ type: ObjectId, scalar: ObjectIdScalar }],
  });
