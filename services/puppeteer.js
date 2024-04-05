"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.close = exports.goTo = exports.init = exports.browser = void 0;
const puppeteer_extra_1 = __importDefault(require("puppeteer-extra"));
const puppeteer_extra_plugin_stealth_1 = __importDefault(require("puppeteer-extra-plugin-stealth"));
puppeteer_extra_1.default.use((0, puppeteer_extra_plugin_stealth_1.default)());
let browser = null;
exports.browser = browser;
const init = async (options = {}) => {
    exports.browser = browser = await puppeteer_extra_1.default.launch(Object.assign({ headless: true, ignoreDefaultArgs: ['--enable-automation', '--no-sandbox', '--disable-setuid-sandbox', '--incognito'] }, options));
    return browser;
};
exports.init = init;
const goTo = async (url) => {
    const page = await browser.newPage();
    await page.goto(url);
    await page.setViewport({ width: 1360, height: 980, deviceScaleFactor: 1 });
    return page;
};
exports.goTo = goTo;
const close = async () => {
    await browser.close();
};
exports.close = close;
