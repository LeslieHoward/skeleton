const {
  sleep,
  genScriptContent,
} = require('./util');
const puppeteer = require('puppeteer');

const desktopDevice = {
  name: 'Desktop 1920x1080',
  userAgent: 'Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/68.0.3440.75 Safari/537.36',
  viewport: {
    width: 1920,
    height: 1080,
  },
};

const openPage = async options => {
  const browser = await puppeteer.launch({
    headless: !options.debug,
    args: [ '--no-sandbox', '--disable-setuid-sandbox' ],
  });
  const page = await browser.newPage();
  const device = puppeteer.devices[options.device] || desktopDevice;
  await page.emulate(device);

  if (options.debug) {
    page.on('console', msg => console.log('PAGE LOG: ', msg.text()));
    page.on('warning', msg => console.log('PAGE WARN: ', JSON.stringify(msg)));
    page.on('error', msg => console.log('PAGE ERR: ', ...msg.args));
  }

  if (options.cookies && options.cookies.length) {
    await page.setCookie(...options.cookies);
    await page.cookies(options.pageUrl);
    await sleep(1000);
  }

  await page.goto(options.pageUrl);

  await page.mainFrame().addScriptTag({ url: 'https://cdn.bootcdn.net/ajax/libs/jquery/3.5.1/jquery.js' });

  const scriptContent = await genScriptContent();

  await page.addScriptTag({ content: scriptContent });

  await sleep(2000);

  return {
    page,
    browser,
  };
};

module.exports = openPage;
