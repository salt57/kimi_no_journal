import cron from "node-cron";
import { switchJournals } from "../../utils";

// run a cron task at 12am IST every day
export const switchJournalCron = cron.schedule(
  "0 0 * * *",
  () => {
    console.log("running a task every day at 12am");
    switchJournals().catch((e) => console.log(e));
  },
  {
    scheduled: true,
    timezone: "Asia/Kolkata",
  }
);
