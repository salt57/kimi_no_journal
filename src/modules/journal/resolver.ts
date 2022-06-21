import { Resolver, Arg, Mutation, Ctx, UseMiddleware } from "type-graphql";
import { Service } from "typedi";
import { ContextType } from "../../bootstrap/loaders/apollo";
import JournalService from "./service";
import { isAuth } from "../../middlewares/isAuth";
import { EditJournalInput } from "./input";
import { Journal } from "../../entities/journal";
import { CreateEntryInput, EditEntryInput } from "../entry/input";

/*
  IMPORTANT: Your business logic must be in the service!
*/

@Service() // Dependencies injection
@Resolver(() => Journal)
export default class JournalResolver {
  constructor(private readonly journalService: JournalService) {}

  @UseMiddleware(isAuth)
  @Mutation(() => Journal)
  async editJournal(
    @Arg("editJournalInput") editJournalInput: EditJournalInput,
    @Ctx() { payload }: ContextType
  ): Promise<Journal> {
    if (!payload) {
      throw new Error("You are not logged in");
    }
    const journal = await this.journalService.editJournal(
      editJournalInput,
      payload.username
    );
    return journal;
  }

  @UseMiddleware(isAuth)
  @Mutation(() => Journal)
  async createEntry(
    @Arg("createEntryData") createEntryData: CreateEntryInput,
    @Ctx() { payload }: ContextType
  ): Promise<Journal> {
    if (!payload) {
      throw new Error("You are not logged in");
    }
    return this.journalService.createEntry(createEntryData, payload.username);
  }

  @UseMiddleware(isAuth)
  @Mutation(() => Journal)
  async editEntry(
    @Arg("newContent") newContent: EditEntryInput,
    @Ctx() { payload }: ContextType
  ): Promise<Journal> {
    if (!payload) {
      throw new Error("You are not logged in");
    }
    const journal = await this.journalService.editEntry(newContent, payload);
    return journal;
  }
}
