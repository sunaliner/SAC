const puppeteer = require("puppeteer");
//selenium 이나 phantomjs

const getStoryContext = async storyCode => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  await page.setDefaultNavigationTimeout(100000);

  //페이지로 가라
  try {
    await page.goto("https://storyai.botsociety.io/show/" + storyCode);
  } catch (error) {
    console.log(error);
    return undefined;
  }

  //로그인 화면이 전환될 때까지 5초만 기다려라
  await page.waitFor(500);
  const mainTextEl = await page.$(".main-text > span");
  const resultsEl = await page.$$(".result > p");
  const mainTextData = await page.evaluate(
    element => element.textContent,
    mainTextEl
  );
  const resultsData = await Promise.all(
    await resultsEl.map((element, index) => {
      const text = page.evaluate(element => element.textContent, element);
      return text;
    })
  );
  let results;
  resultsData.map(data => {
    if (data !== undefined || data !== "undefined") results += data + "\n";
  });
  await browser.close();
  return mainTextData + "\n" + results;
};
const getCardParams = async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  //페이지로 가라
  await page.goto("https://storyai.botsociety.io/");

  //로그인 화면이 전환될 때까지 .3초만 기다려라
  await page.waitFor(300);
  const elements = await page.$$(".card-body > h5");
  const params = await Promise.all(
    await elements.map((element, index) => {
      const param = page.evaluate(
        element => ({
          code: element.id.split("_")[1],
          title: element.textContent
        }),
        element
      );
      return param;
    })
  );
  await browser.close();
  return params;
};

exports.getStoryContext = getStoryContext;
exports.getCardParams = getCardParams;
