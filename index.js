"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.close = exports.createChat = exports.singleMessage = exports.init = void 0;
const pptr = __importStar(require("./services/puppeteer"));
const html_to_text_1 = require("html-to-text");
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
const init = async () => {
    await pptr.init();
};
exports.init = init;
const singleMessage = async (text) => {
    const page = await pptr.goTo(CHAT_GPT_URL);
    await page.waitForSelector("#prompt-textarea");
    await typeClick(page, text);
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
exports.singleMessage = singleMessage;
const createChat = async (text) => {
    let responseMessageId = 3;
    const history = [];
    const page = await pptr.goTo(CHAT_GPT_URL);
    const send = async (message) => {
        await typeClick(page, message);
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
    const response = await send(text);
    return {
        response,
        history,
        send,
        close,
    };
};
exports.createChat = createChat;
const close = async () => {
    await pptr.close();
};
exports.close = close;
