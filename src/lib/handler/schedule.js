const schedule = async (crawler, database) => {
  console.log(new Date());
  let dbData;
  let cwData;
  let postCount;

  // post data 불러오기
  dbData = await database.post.select();
  postCount = dbData.length;

  // 저장된 post 수가 100이 넘지 않을 경우 db에 총 100개까지 저장
  if (dbData && postCount < 100) {
    cwData = await crawler.getCardParams();

    // 중복된 post code 걸러내기
    cwData = cwData.filter(value => {
      return dbData.find(x => x.code === value.code) === undefined
        ? true
        : false;
    });
    // if (cwData[0]) {
    //   console.log(cwData[0].code);
    //   const context = await crawler.getStoryContext(cwData[0].code);
    //   console.log(context);
    //   if (context)
    //     await database.post.insert({
    //       code: cwData[0].code,
    //       title: cwData[0].title,
    //       context: context
    //     });
    // }

    // story 긁어와서 db에 저장
    if (cwData.length > 0 && process.getMaxListeners() <= 100) {
      const list = await Promise.all(
        cwData.map(async (data, index) => {
          if (postCount < 100) {
            const context = await crawler.getStoryContext(data.code);
            console.log(
              "code :",
              data.code,
              "count :",
              index,
              "isContext :",
              context ? true : false
            );
            return { code: data.code, title: data.title, context: context };
            // const param = {code:data.code,title:data.title,context:postContext}
            // await database.post.insert(param)
            // console.log('code =', code ,'가 저장됨')
          }
        })
      );
      console.log("db insert start");
      await database.post.insert(list);
      console.log("db insert finish");
    } else {
      console.log("MaxListeners :", process.getMaxListeners());
    }
  }
};

exports.default = schedule;
