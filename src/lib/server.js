// const express = require("express");
const database = require("./database");
const dotenv = require("dotenv");
const crawler = require("./crawler");
const translater = require("./translater");
const schedule = require("node-schedule");

dotenv.config();

// const app = express();

const start = (handler, route) => {
  // app.get("/", function(req, res) {});
  console.log("SAC service start!");

  // handler.schedule(crawler, database, translater);
  var scheduler = schedule.scheduleJob("* * */5 * * *", () => {
    console.log("database connect!");
    database.connect();
    console.log(new Date(), "=> 크롤링 시작!");

    handler.schedule(crawler, database, translater);
  });

  process.setMaxListeners(100);
  // app.listen(3000, () => console.log("Server running on port 3000!"));
};
exports.start = start;
