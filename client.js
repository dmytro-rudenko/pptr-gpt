"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
const puppeteer_1 = __importDefault(require("./services/puppeteer"));
const html_to_text_1 = require("html-to-text");
const storage_1 = __importDefault(require("./services/storage"));
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const CHAT_GPT_URL = "https://chat.openai.com";
const PREPAND = "ChatGPT\nChatGPT";
const HTML_TO_TEXT_OPTIONS = {
    wordwrap: 130,
};
var Role;
(function (Role) {
    Role["USER"] = "user";
    Role["ASSISTANT"] = "assistant";
})(Role || (Role = {}));
const typeClick = async (page, text) => {
    await page.type("#prompt-textarea", text);
    await page.click("button[data-testid='send-button']");
};
const init = async (options) => {
    const params = {};
    if (options.hasOwnProperty('headless')) {
        params.headless = options.headless;
    }
    if (options.hasOwnProperty('screenshots')) {
        storage_1.default.set('screenshots', String(options.screenshots));
        // create public directory if it doesn't exist
        if (!fs_1.default.existsSync(path_1.default.join(__dirname, 'public'))) {
            fs_1.default.mkdirSync(path_1.default.join(__dirname, 'public'));
        }
    }
    await puppeteer_1.default.init(params);
};
const singleMessage = async (text) => {
    const page = await puppeteer_1.default.goTo(CHAT_GPT_URL);
    const screenshots = storage_1.default.get('screenshots');
    // screenshot
    if (screenshots) {
        await page.screenshot({ path: path_1.default.join(__dirname, 'public/screenshot.png') });
    }
    await page.waitForSelector("#prompt-textarea", {
        timeout: 60000
    });
    await typeClick(page, text);
    if (screenshots) {
        await page.screenshot({ path: path_1.default.join(__dirname, 'public/screenshot2.png') });
    }
    const response = await page.evaluate(async () => {
        var _a;
        let prevText = null;
        let currentText = (_a = document.querySelector(`div[data-testid='conversation-turn-3']`)) === null || _a === void 0 ? void 0 : _a.innerHTML;
        const getHTML = async () => {
            return new Promise((resolve) => {
                const interval = setInterval(() => {
                    var _a;
                    prevText = currentText;
                    currentText = (_a = document.querySelector(`div[data-testid='conversation-turn-3']`)) === null || _a === void 0 ? void 0 : _a.innerHTML;
                    if (currentText && prevText === currentText) {
                        clearInterval(interval);
                        resolve(currentText);
                    }
                }, 3000);
            });
        };
        return getHTML();
    });
    page.close();
    return (0, html_to_text_1.convert)(response, HTML_TO_TEXT_OPTIONS)
        .replace(PREPAND, "")
        .trim();
};
const createChat = async (text) => {
    let responseMessageId = 3;
    const history = [];
    const page = await puppeteer_1.default.goTo(CHAT_GPT_URL);
    const send = async (message) => {
        const screenshots = storage_1.default.get('screenshots');
        await typeClick(page, message);
        if (screenshots) {
            await page.screenshot({ path: path_1.default.join(__dirname, `public/screenshot-${responseMessageId + 1}.png`) });
        }
        history.push({
            role: Role.USER,
            content: message,
        });
        const response = await page.evaluate(async ({ responseMessageId }) => {
            var _a;
            let prevText = null;
            let currentText = (_a = document.querySelector(`div[data-testid='conversation-turn-${responseMessageId}']`)) === null || _a === void 0 ? void 0 : _a.innerHTML;
            const getHTML = async () => {
                return new Promise((resolve) => {
                    const interval = setInterval(() => {
                        var _a;
                        prevText = currentText;
                        currentText = (_a = document.querySelector(`div[data-testid='conversation-turn-${responseMessageId}']`)) === null || _a === void 0 ? void 0 : _a.innerHTML;
                        if (currentText && prevText === currentText) {
                            clearInterval(interval);
                            resolve(currentText);
                        }
                    }, 3000);
                });
            };
            return getHTML();
        }, {
            responseMessageId,
        });
        responseMessageId += 2;
        const answer = (0, html_to_text_1.convert)(response, HTML_TO_TEXT_OPTIONS)
            .replace(PREPAND, "")
            .trim();
        history.push({
            role: Role.ASSISTANT,
            content: answer,
        });
        return answer;
    };
    const close = async () => {
        await page.close();
    };
    await page.waitForSelector("#prompt-textarea", {
        timeout: 60000
    });
    const response = await send(text);
    return {
        response,
        history,
        send,
        close,
    };
};
const close = async () => {
    await puppeteer_1.default.close();
};
const client = { init, singleMessage, createChat, close };
module.exports = client;
