import { Service } from "typedi";
import { ObjectId } from "mongodb";
import JournalModel from "./model";
import { Journal } from "../../entities/journal";
import { EditJournalInput } from "./input";
import UserModel from "../user/model";

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
}
