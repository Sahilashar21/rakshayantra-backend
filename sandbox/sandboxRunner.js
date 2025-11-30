// const puppeteer = require("puppeteer-core");

// const url = process.argv[2];

// (async () => {
//   if (!url) {
//     console.log(JSON.stringify({ error: "No URL provided" }));
//     return;
//   }

//   const browser = await puppeteer.launch({
//     headless: "new",
//     executablePath: "/usr/bin/chromium",
//     args: ["--no-sandbox", "--disable-setuid-sandbox"]
//   });

//   const page = await browser.newPage();

//   let logs = [];
//   let requests = [];
//   let responses = [];

//   page.on("request", (req) => {
//     requests.push({ url: req.url(), method: req.method() });
//   });

//   page.on("response", (res) => {
//     responses.push({ url: res.url(), status: res.status() });
//   });

//   page.on("console", (msg) => {
//     logs.push({ type: "console", text: msg.text() });
//   });

//   try {
//     await page.goto(url, { waitUntil: "networkidle2", timeout: 15000 });
//   } catch (err) {
//     logs.push({ type: "error", text: "Navigation timeout or blocked" });
//   }

//   const html = await page.content();

//   await browser.close();

//   console.log(JSON.stringify({ html, logs, requests, responses }));
// })();


const puppeteer = require("puppeteer-core");

const url = process.argv[2];

(async () => {
  if (!url) {
    console.log(JSON.stringify({ error: "No URL provided" }));
    return;
  }

  const browser = await puppeteer.launch({
    headless: "new",
    executablePath: "/usr/bin/chromium",
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  });

  const page = await browser.newPage();

  let logs = [];
  let requests = [];
  let responses = [];

  page.on("request", (req) =>
    requests.push({ url: req.url(), method: req.method() })
  );

  page.on("response", (res) =>
    responses.push({ url: res.url(), status: res.status() })
  );

  page.on("console", (msg) =>
    logs.push({ type: "console", text: msg.text() })
  );

  try {
    await page.goto(url, { waitUntil: "networkidle2", timeout: 15000 });
  } catch (e) {
    logs.push({ type: "error", text: "Navigation timeout" });
  }

  const html = await page.content();

  await browser.close();

  console.log(JSON.stringify({ html, logs, requests, responses }));
})();
