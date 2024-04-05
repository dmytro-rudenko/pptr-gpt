import puppeteer from 'puppeteer-extra';
import StealthPlugin from 'puppeteer-extra-plugin-stealth';

puppeteer.use(StealthPlugin());

let browser: any = null;

const init = async (options = {}): Promise<any> => {
  browser = await puppeteer.launch({
    headless: false,
    ignoreDefaultArgs: ['--enable-automation', '--no-sandbox', '--disable-setuid-sandbox', '--incognito'],
    ...options,
  });
  return browser;
};

const goTo = async (url: string): Promise<any> => {
  const page = await browser!.newPage();
  await page.goto(url);
  await page.setViewport({ width: 1360, height: 980, deviceScaleFactor: 1 });
  return page;
};

const close = async (): Promise<void> => {
  await browser!.close();
};

export { browser, init, goTo, close };