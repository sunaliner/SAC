// const express = require("express");
const database = require("./database");
const dotenv = require("dotenv");
const crawler = require("./crawler");

dotenv.config();

// const app = express();

const start = (handler, route) => {
  // app.get("/", function(req, res) {});
  console.log("SAC service start!");
  database.connect();
  console.log("database connect!");

  handler.schedule(crawler, database);
  // var scheduler = schedule.scheduleJob("* * */1 * * *", handler.schedule);

  process.setMaxListeners(100);
  // app.listen(3000, () => console.log("Server running on port 3000!"));
};
exports.start = start;
