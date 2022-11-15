import express from "express";
import { start } from "./cli_cron.js"
import CronJob from "node-cron";
import pg from 'pg'

const client = new pg.Client({
  user: 'postgres',
  host: 'db',
  database: 'question_two',
  password: 'postgres',
  port: 5432,
})
client.connect()
const app = express();
app.set("port", process.env.PORT || 3000);


async function executeInsertQuery(text, values) {
  try {
    const res = await client.query(text, values)
    return res.rows.length
  } catch (err) {
    console.log(err.stack)
  }
}

async function saveDuplicatedFile(sql) {
  const howManyItems = "select count(*) from files_storage where file_name = $1";
  try {
    const res = await client.query(howManyItems, [node['file_name']]);
    const { count } = res.rows[0];
    const values = [node['url'], node['file_name'] + "-" + count, node['binary_data'].toString('base64')];
    const success = 1 == await executeInsertQuery(sql, values);
    if(!success){
      console.log("Failed to save duplicated file!")
    }
  } catch (err) {
    console.log(err.stack);
  }
}

const saveFile = async (data) => {
  await data.map(async (node) => {
    const sql = "\
    INSERT INTO files_storage (url,file_name,bytes)\
	  VALUES ($1,$2,$3) on conflict do nothing"
    const values = [node['url'], node['file_name'], node['binary_data'].toString('base64')]
    const success = 1 == await executeInsertQuery(sql, values)
    if (!success) {
      await saveDuplicatedFile();
    }
  })
}


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
