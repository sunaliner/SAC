const puppeteer = require("puppeteer");

// 사용시 인위적인 딜레이를 주기위한 함수

function delay(timeout) {
  return new Promise(resolve => {
    setTimeout(resolve, timeout);
  });
}

puppeteer
  .launch({
    headless: false, // 헤드리스모드의 사용여부를 묻는다.

    devtools: true // 개발자 모드의 사용여부를 묻는다.
  })
  .then(async browser => {
    const page = await browser.newPage();

    // 로그인할 티스토리 블로그의 관리자 페이지를 지정

    await page.goto("http://magic.wickedmiso.com/manage/", {
      waitUntil: "networkidle2"
    });

    // 티스토리의 아이디와 암호를 입력한다.

    await page.type(
      "div.box_login > div.inp_text:nth-child(1) > input#loginId",
      "티스토리 아이디"
    );

    await page.type(
      "div.box_login > div.inp_text:nth-child(2) > input#loginPw",
      "티스토리 패스워드"
    );

    /* document.getElementByI로 직접 입력할 input BOX를 선택하여 작업하는 것도 가능하다.

	await page.evaluate(() => {

		document.getElementById( "div.box_login > div.inp_text:nth-child(1) > input#loginId" ).value = "티스토리 아이디";

                document.getElementById( "div.box_login > div.inp_text:nth-child(2) > input#loginPw" ).value = "티스토리 패스워드";

	});

	*/

    await delay(3000);

    // 로그인 SUBMIT 기능

    const elementHandle = await page.waitFor("input");

    await elementHandle.press("Enter");

    await delay(5000);

    /* 로그인이후 방문 기록 데이터를 콘솔에 띄워본다. */

    const emToDay = await page.waitFor(
      "div.box_blog > dl.count_visitor:nth-child(1) > dd"
    );

    const txtToDay = await page.evaluate(
      emToDay => emToDay.textContent,
      emToDay
    );

    console.log("-. 오늘 방문자 수", txtToDay);

    const emYesterDay = await page.waitFor(
      "div.box_blog > dl.count_visitor:nth-child(2) > dd"
    );

    const txtYesterDay = await page.evaluate(
      emYesterDay => emYesterDay.textContent,
      emYesterDay
    );

    console.log("-. 어제 방문자 수", txtYesterDay);

    const emCumulativ = await page.waitFor(
      "div.box_blog > dl.count_visitor:nth-child(3) > dd"
    );

    const txtCumulativ = await page.evaluate(
      emCumulativ => emCumulativ.textContent,
      emCumulativ
    );

    console.log("-. 누적 방문자 수", txtCumulativ);
  });
