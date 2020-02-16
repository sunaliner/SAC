const puppeteer = require("puppeteer");
//selenium 이나 phantomjs

const getStoryContext = async storyCode => {
  const browser = await puppeteer.launch({ args: ["--no-sandbox"] });
  const page = await browser.newPage();
  await page.setRequestInterception(true);
  page.on("request", req => {
    switch (req.resourceType()) {
      case "stylesheet":
      case "font":
      case "image":
        req.abort();
        break;
      default:
        req.continue();
        break;
    }
  });

  await page.setDefaultNavigationTimeout(100000);

  //페이지로 가라
  try {
    await page.goto("https://storyai.botsociety.io/show/" + storyCode);
    console.log(
      "crawler : goto => https://storyai.botsociety.io/show/" + storyCode
    );
  } catch (error) {
    console.log(error);
  }

  //로그인 화면이 전환될 때까지 3초만 기다려라
  await page.waitFor(3000);
  let mainTextEl = await page.$(".main-text > span");
  let resultsEl = await page.$$(".result > p");
  if (mainTextEl || resultsEl) {
    await page.waitFor(5000);
    mainTextEl = await page.$(".main-text > span");
    resultsEl = await page.$$(".result > p");
  }
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
  var results = "";
  resultsData.map(data => {
    if (data !== undefined || data !== "undefined") results += data + "\n";
  });
  await browser.close();
  if (resultsData && results && results !== "" && resultsData !== "")
    return mainTextData + "\n" + results;
  else return undefined;
};
const getCardParams = async () => {
  const browser = await puppeteer.launch({ args: ["--no-sandbox"] });
  const page = await browser.newPage();
  await page.setRequestInterception(true);
  page.on("request", req => {
    switch (req.resourceType()) {
      case "stylesheet":
      case "font":
      case "image":
        req.abort();
        break;
      default:
        req.continue();
        break;
    }
  });

  //페이지로 가라
  await page.setDefaultNavigationTimeout(100000);
  await page.goto("https://storyai.botsociety.io/");

  //로그인 화면이 전환될 때까지 .3초만 기다려라
  await page.waitFor(1000);
  let elements = await page.$$(".card-body > h5");
  if (elements.length <= 0) {
    await page.waitFor(3000);
    elements = await page.$$(".card-body > h5");
    if (elements.length <= 0) {
      await page.waitFor(5000);
      elements = await page.$$(".card-body > h5");
    }
  }
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
