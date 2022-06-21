import { Service } from "typedi";
import { ObjectId } from "mongodb";
import JournalModel from "./model";
import { Journal } from "../../entities/journal";
import { EditJournalInput } from "./input";
import UserModel from "../user/model";
import { CreateEntryInput, EditEntryInput } from "../entry/input";

@Service() // Dependencies injection
export default class JournalService {
  constructor(
    private readonly journalModel: JournalModel,
    private readonly userModel: UserModel
  ) {}

  public async getById(_id: ObjectId): Promise<Journal | null> {
    return this.journalModel.getById(_id);
  }

  public async editJournal(
    editJournalInput: EditJournalInput,
    username: string
  ): Promise<Journal> {
    const user = await this.userModel.getByUsername(username);
    if (!user) {
      throw new Error("User not found");
    }
    const journal = user.journal as Journal;
    if (!journal) {
      throw new Error("Journal not found");
    }
    return this.journalModel.editJournal(journal._id, editJournalInput);
  }

  public async createEntry(
    data: CreateEntryInput,
    username: string
  ): Promise<Journal> {
    const user = await this.userModel.getByUsername(username);
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

  public async editEntry(
    newContent: EditEntryInput,
    payload: { username: string }
  ): Promise<Journal> {
    // check if user is owner of entry
    const user = await this.userModel.getByUsername(payload.username);
    if (!user) {
      throw new Error("User not found");
    }
    const journal = user.journal as Journal;
    if (!journal) {
      throw new Error("Journal not found");
    }
    if (
      !journal.entries
        .map((e) => e._id.toString())
        .includes(newContent.id.toString())
    ) {
      throw new Error("You are not the owner of this entry");
    }
    return this.journalModel.editEntry(journal._id, newContent);
  }
}
