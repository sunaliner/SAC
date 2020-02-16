// const express = require("express");
const database = require("./database");
const dotenv = require("dotenv");
const crawler = require("./crawler");
const translater = require("./translater");
const schedule = require("node-schedule");

dotenv.config();

// const app = express();
const node_env = process.env.NODE_ENV;

const start = (handler, route) => {
  // app.get("/", function(req, res) {});
  console.log("SAC service start! => ENV =", node_env);

  switch (node_env) {
    case "development":
      // var scheduler = schedule.scheduleJob("*/2 * * * *", () => {
      console.log("database connect!");
      database.connect();
      console.log(new Date(), "=> 크롤링 시작!");

      handler.schedule(crawler, database, translater, node_env);
      // });
      break;
    case "local":
      console.log("database connect!");
      database.connect();
      console.log(new Date(), "=> test 크롤링 시작!");

      handler.schedule(crawler, database, translater, node_env);
      break;
    case "production":
      var scheduler = schedule.scheduleJob("*/4 * * *", () => {
        console.log("database connect!");
        database.connect();
        console.log(new Date(), "=> 크롤링 시작!");

        handler.schedule(crawler, database, translater, node_env);
      });
      break;

    default:
      break;
  }

  process.setMaxListeners(100);
  // app.listen(3000, () => console.log("Server running on port 3000!"));
};
exports.start = start;
