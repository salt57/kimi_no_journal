import { getModelForClass } from "@typegoose/typegoose";
import { ObjectId } from "mongodb";
import { Service } from "typedi";
import { Entry } from "../../entities/entry";
import { Journal } from "../../entities/journal";
import JournalModel from "../journal/model";
import { CreateEntryInput, EditEntryInput } from "./input";

// This generates the mongoose model for us
export const EntryMongooseModel = getModelForClass(Entry, {
  schemaOptions: { timestamps: true },
});

@Service()
export default class EntryModel {
  constructor(private readonly journalModel: JournalModel) {}
  async getById(_id: ObjectId): Promise<Entry | null> {
    // Use mongoose as usual
    return EntryMongooseModel.findById(_id).lean().exec();
  }

  async create(data: CreateEntryInput): Promise<Entry> {
    const entry = await EntryMongooseModel.create(data);

    return entry.save();
  }
}
