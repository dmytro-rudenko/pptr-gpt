"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const puppeteer_extra_1 = __importDefault(require("puppeteer-extra"));
const puppeteer_extra_plugin_stealth_1 = __importDefault(require("puppeteer-extra-plugin-stealth"));
puppeteer_extra_1.default.use((0, puppeteer_extra_plugin_stealth_1.default)());
const usePuppeteer = () => {
    let browser = null;
    const init = async (options) => {
        const params = Object.assign({ headless: 'shell', ignoreDefaultArgs: ['--enable-automation', '--no-sandbox', '--disable-setuid-sandbox', '--incognito'] }, options);
        browser = await puppeteer_extra_1.default.launch(params);
        return browser;
    };
    const goTo = async (url) => {
        const page = await browser.newPage();
        await page.goto(url);
        await page.setViewport({ width: 1360, height: 980, deviceScaleFactor: 1 });
        return page;
    };
    const close = async () => {
        await browser.close();
    };
    return { browser, init, goTo, close };
};
exports.default = usePuppeteer();
