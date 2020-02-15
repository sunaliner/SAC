const mysql = require("mysql");
const post = require("./post");

var db;

process.title = "SAC";

const connect = () => {
  db = mysql.createConnection({
    host: process.env.MYSQL_HOST,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASS,
    database: process.env.MYSQL_DATABASE
  });

  db.connect();
};

const query = sql => {
  return new Promise((resolve, reject) => {
    db.query(sql, (err, rows) => {
      if (err) return reject(err);
      resolve(rows);
    });
  });
};
const selectQuery = tableName => {
  return query("SELECT * FROM " + tableName);
};
const getFields = params => {
  const keys = Object.keys(params);
  let fields = "";
  keys.map((x, i) => {
    fields += x + (i === keys.length - 1 ? "" : ", ");
  });
  return fields;
};
const getValues = params => {
  let ref = JSON.stringify(Object.keys(params).map(x => params[x]));
  ref = ref.slice(1, -1);
  return ref;
};
const getValuesMulti = params => {
  let ref = "";
  params.map(param => {
    let p = getValues(param);
    ref += " (" + p + ") ";
  });
  return ref;
};
const insertQuery = (tableName, params) => {
  let sql;
  if (Array.isArray(params)) {
    sql = `INSERT INTO ${tableName} (${getFields(
      params[0]
    )}) VALUES ${getValuesMulti(params)}`;
  } else if (typeof params === "object") {
    sql = `INSERT INTO ${tableName} (${getFields(params)}) VALUES (${getValues(
      params
    )})`;
  } else {
    console.log("insert params null");
    return undefined;
  }
  // console.log(sql);
  return query(sql);
};
// INSERT INTO 테이블이름(필드이름1, 필드이름2, 필드이름3, ...)

//  VALUES (데이터값1, 데이터값2, 데이터값3, ...)
const cancel = () => {
  connect.end();
};

exports.connect = connect;
exports.query = query;
exports.selectQuery = selectQuery;
exports.insertQuery = insertQuery;
exports.cancel = cancel;

exports.post = post;
