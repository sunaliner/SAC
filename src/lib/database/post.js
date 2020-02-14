const database = require("./index");
const tableName = "post";

const select = () => {
  return database.selectQuery(tableName);
};

const insert = params => {
  return database.insertQuery(tableName, params);
};

const update = (id, params) => {};

const _delete = id => {};

exports.select = select;
exports.insert = insert;
exports.update = update;
exports.delete = _delete;
