import express from "express";
import {start} from "./cli_cron.js"
import CronJob from "node-cron";

const app = express();
app.set("port", process.env.PORT || 3000);

function processData(data){

}

function cron() {
  CronJob.schedule("*/10 * * * * *", () => {
    console.log("I'm executed on a schedule!");
    const data = start()
    processData(data)
  });
}


app.listen(app.get("port"), () => {
  console.log("Express server listening on port " + app.get("port"));
  cron();
});
