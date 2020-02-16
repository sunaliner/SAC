const schedule = async (crawler, database, translater, node_env) => {
  let dbData;
  let cwData;

  // post data 불러오기
  dbData = await database.post.select();
  postCount = dbData.length;

  if (dbData) {
    cwData = await crawler.getCardParams();

    console.log("crawler count : ", cwData.length);
    // 중복된 post code 걸러내기
    if (dbData.length > 0)
      cwData = cwData.filter(value => {
        return dbData.find(x => x.code === value.code) === undefined
          ? true
          : false;
      });

    if (cwData.length > 0 && node_env === "local") {
      dataInsert(crawler, database, translater, cwData[0]);
    }

    // story 긁어와서 db에 저장
    console.log("crawler count - db : ", cwData.length);
    if (cwData.length > 0 && node_env !== "local") {
      await cwData.reduce(async (fn, data, index) => {
        await fn;
        return dataInsert(crawler, database, translater, data, index);
      }, Promise.resolve());
      // await Promise.all(
      //   cwData.map((data, index) => {
      //     return dataInsert(crawler, database, translater, data, index);
      //   })
      // );
      console.log("schedule : story post insert finish");
    } else {
      console.log("MaxListeners :", process.getMaxListeners());
    }
  }
};

const dataInsert = async (crawler, database, translater, data, index = 0) => {
  let context = await crawler.getStoryContext(data.code);
  let isContext =
    context && context != "\nundefined" && (context !== "") & (context !== " ")
      ? true
      : false;
  console.log(
    "code :",
    data.code + ", count :",
    index + ", isContext :",
    isContext
  );
  if (isContext) {
    context = await translater.translateText(context, "ko");
    let title = await translater.translateText(data.title, "ko");
    const param = {
      code: data.code,
      title: title,
      context: context
    };

    database.post
      .insert(param)
      .then(res => {
        console.log("database :", param.code, "=> insert success");
      })
      .catch(err => {
        console.log(err);
      });
  } else console.log(context);
};

exports.default = schedule;
