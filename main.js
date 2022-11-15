import express from "express";
import { start } from "./cli_cron.js"
import CronJob from "node-cron";
import  {saveFile}  from "./DbDal.js"

const app = express();
app.set("port", process.env.PORT || 3000);



async function cron() {
  CronJob.schedule("*/10 * * * * *", async () => {
    console.log("Fetching data...");
    const data = await start()
    await saveFile(data)
  });
}

app.listen(app.get("port"), async () => {
  console.log("Express server listening on port " + app.get("port"));
  await cron();
});
