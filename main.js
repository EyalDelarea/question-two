import express from "express";
import { start } from "./modules/cli_cron.js"
import CronJob from "node-cron";
import  {saveFile}  from "./modules/DbDal.js"

const app = express();
app.set("port", process.env.PORT || 3000);



async function cron() {
  await CronJob.schedule("* */5 * * * *", async () => {
    console.log("Fetching data...");
    const data = await start()
    await saveFile(data)
    console.log("done saving the data to DB!")
  });
}

app.listen(app.get("port"), async () => {
  console.log("Express server listening on port " + app.get("port"));
  await cron();
});
