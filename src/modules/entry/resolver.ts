import { Resolver, Arg, Mutation, Ctx, UseMiddleware } from "type-graphql";
import { Service } from "typedi";
import { ContextType } from "../../bootstrap/loaders/apollo";
import { Entry } from "../../entities/entry";
import { isAuth } from "../../middlewares/isAuth";
import { CreateEntryInput, EditEntryInput } from "./input";
import EntryService from "./service";
import { Journal } from "../../entities/journal";

/*
  IMPORTANT: Your business logic must be in the service!
*/

@Service() // Dependencies injection
@Resolver(() => Entry)
export default class EntryResolver {
  constructor(private readonly entryService: EntryService) {}

  @UseMiddleware(isAuth)
  @Mutation(() => Journal)
  async createEntry(
    @Arg("createEntryData") createEntryData: CreateEntryInput,
    @Ctx() { payload }: ContextType
  ): Promise<Journal> {
    if (!payload) {
      throw new Error("You are not logged in");
    }
    return this.entryService.createEntry(createEntryData, payload.username);
  }

  @UseMiddleware(isAuth)
  @Mutation(() => Entry)
  async editEntry(
    @Arg("newContent") newContent: EditEntryInput,
    @Ctx() { payload }: ContextType
  ): Promise<Entry> {
    if (!payload) {
      throw new Error("You are not logged in");
    }
    const entry = await this.entryService.editEntry(newContent, payload);
    return entry;
  }
}
