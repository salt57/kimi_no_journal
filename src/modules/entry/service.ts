import { Service } from "typedi";
import { ObjectId } from "mongodb";
import { CreateEntryInput, EditEntryInput } from "./input";
import { Entry } from "../../entities/entry";
import UserService from "../user/service";
import { Journal } from "../../entities/journal";
import EntryModel from "./model";
import JournalModel from "../journal/model";

@Service() // Dependencies injection
export default class EntryService {
  constructor(
    private readonly entryModel: EntryModel,
    private readonly userService: UserService,
    private readonly journalModel: JournalModel
  ) {}

  public async getById(_id: ObjectId): Promise<Entry | null> {
    return this.entryModel.getById(_id);
  }

  // edit entry
  public async editEntry(
    newContent: EditEntryInput,
    payload: { username: string }
  ): Promise<Entry> {
    const entry = await this.entryModel.getById(newContent.id);
    if (!entry) {
      throw new Error("Entry not found");
    }
    // check if user is owner of entry
    const user = await this.userService.getByUsername(payload.username);
    if (!user) {
      throw new Error("User not found");
    }
    const journal = user.journal as Journal;
    if (!journal) {
      throw new Error("Journal not found");
    }
    if (!journal.entries.map((e) => e._id).includes(entry._id)) {
      throw new Error("You are not the owner of this entry");
    }
    return this.entryModel.editEntry(newContent);
  }

  public async createEntry(
    data: CreateEntryInput,
    username: string
  ): Promise<Journal> {
    const user = await this.userService.getByUsername(username);
    if (!user) {
      throw new Error("User not found");
    }

    const journal = user.journal as Journal;
    if (!journal) {
      throw new Error("Journal not found");
    }

    return this.journalModel.createEntry(data, journal._id);

    // Business logic goes here
    // Example:
    // Trigger push notification, analytics, ...
  }
}
