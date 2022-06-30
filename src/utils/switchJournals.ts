import { UserMongooseModel } from "../modules/user/model";

export const switchJournals = async () => {
  const users = await UserMongooseModel.find({});
  const alreadySwitched = [] as string[];
  users.map(async (user) => {
    if (alreadySwitched.includes(user.username)) return;
    alreadySwitched.push(user.username);
    alreadySwitched.push(user.partner);
    const partner = users.find((user2) => user2.username === user.partner);
    if (!partner) return;
    [user.journal, partner.journal] = [partner.journal, user.journal];
    await user.save();
    await partner.save();
  });
};
