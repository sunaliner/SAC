const schedule = async (crawler, database, translater) => {
  console.log(new Date());
  let dbData;
  let cwData;
  let postCount;

  // post data 불러오기
  dbData = await database.post.select();
  postCount = dbData.length;

  if (dbData) {
    cwData = await crawler.getCardParams();

    // 중복된 post code 걸러내기
    cwData = cwData.filter(value => {
      return dbData.find(x => x.code === value.code) === undefined
        ? true
        : false;
    });

    // story 긁어와서 db에 저장
    if (cwData.length > 0 && process.getMaxListeners() <= 100) {
      await Promise.all(
        cwData.map(async (data, index) => {
          if (postCount < 100) {
            let context = await crawler.getStoryContext(data.code);
            let isContext = context && context != "\nundefined" ? true : false;

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
            }
          }
        })
      );
      console.log("schedule : story post insert finish");
    } else {
      console.log("MaxListeners :", process.getMaxListeners());
    }
  }
};

exports.default = schedule;
