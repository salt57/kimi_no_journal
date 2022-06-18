import { getModelForClass } from "@typegoose/typegoose";
import { ObjectId } from "mongodb";
import { Service } from "typedi";
import { Journal } from "../../entities/journal";
import { CreateEntryInput } from "../entry/input";
import EntryModel from "../entry/model";
import { EditJournalInput } from "./input";

// This generates the mongoose model for us
export const JournalMongooseModel = getModelForClass(Journal, {
  schemaOptions: { timestamps: true },
});

@Service()
export default class JournalModel {
  constructor(private readonly entryModel: EntryModel) {}

  async getById(_id: ObjectId): Promise<Journal | null> {
    // Use mongoose as usual
    return JournalMongooseModel.findById(_id).lean().exec();
  }

  async create(data: { title: string }): Promise<Journal> {
    const journal = await JournalMongooseModel.create({ title: data.title });

    return journal.save();
  }

  async createEntry(
    data: CreateEntryInput,
    journalId: ObjectId
  ): Promise<Journal> {
    const journal = await JournalMongooseModel.findById(journalId);
    if (!journal) {
      throw new Error("Journal not found");
    }
    const entry = await this.entryModel.create(data);
    journal.entries.push(entry);
    return journal.save();
  }

  async editJournal(_id: ObjectId, data: EditJournalInput): Promise<Journal> {
    const journal = await JournalMongooseModel.findById(_id);
    if (!journal) {
      throw new Error("Journal not found");
    }
    journal.title = data.title;
    return journal.save();
  }
}
