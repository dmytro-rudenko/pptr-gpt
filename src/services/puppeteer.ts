import puppeteer from 'puppeteer-extra';
import StealthPlugin from 'puppeteer-extra-plugin-stealth';

puppeteer.use(StealthPlugin());

const usePuppeteer = () => {
  let browser: any = null;

  const init = async (options: {
    headless?: boolean | 'shell' | undefined;
  }): Promise<any> => {
    console.log('init options', options);

    const params: {
      headless?: boolean | 'shell' | undefined
      ignoreDefaultArgs?: string[]
    } = {
      headless: 'shell',
      ignoreDefaultArgs: ['--enable-automation', '--no-sandbox', '--disable-setuid-sandbox', '--incognito'],
      ...options,
    }

    console.log('browser params', params);

    browser = await puppeteer.launch(params);

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

  return { browser, init, goTo, close };
}

export default usePuppeteer()