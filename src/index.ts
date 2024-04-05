import * as pptr from "./services/puppeteer";
import { convert } from "html-to-text";

const CHAT_GPT_URL = "https://chat.openai.com";
const PREPAND = "ChatGPT\nChatGPT";

const HTML_TO_TEXT_OPTIONS = {
  wordwrap: 130,
}

enum Role {
  USER = "user",
  ASSISTANT = "assistant",
}

interface ChatHistory {
  role: Role;
  content: string;
}

const typeClick = async (page: any, text: string): Promise<void> => {
  await page.type("#prompt-textarea", text);
  await page.click("button[data-testid='send-button']");
};

const init = async (): Promise<void> => {
  await pptr.init();
};

const singleMessage = async (text: string): Promise<string> => {
  const page = await pptr.goTo(CHAT_GPT_URL);

  await page.waitForSelector("#prompt-textarea");
  await typeClick(page, text);

  const response = await page.evaluate(async () => {
    let prevText: string | null = null;
    let currentText: any = document.querySelector(
      `div[data-testid='conversation-turn-3']`
    )?.innerHTML;

    const getHTML = async (): Promise<string> => {
      return new Promise((resolve) => {
        const interval = setInterval(() => {
          prevText = currentText;

          currentText = document.querySelector(
            `div[data-testid='conversation-turn-3']`
          )?.innerHTML;

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

  return convert(response, HTML_TO_TEXT_OPTIONS)
    .replace(PREPAND, "")
    .trim();

};

const createChat = async (text: string): Promise<{
  response: string;
  history: ChatHistory[];
  send: (message: string) => Promise<string>;
  close: () => Promise<void>;
}> => {
  let responseMessageId = 3;

  const history: ChatHistory[] = [];
  const page = await pptr.goTo(CHAT_GPT_URL);

  const send = async (message: string): Promise<string> => {
    await typeClick(page, message);

    history.push({
      role: Role.USER,
      content: message,
    });

    const response = await page.evaluate(
      async ({ responseMessageId }: { responseMessageId: number }) => {
        let prevText: string | null = null;
        let currentText: any = document.querySelector(
          `div[data-testid='conversation-turn-${responseMessageId}']`
        )?.innerHTML;

        const getHTML = async (): Promise<string> => {
          return new Promise((resolve) => {
            const interval = setInterval(() => {
              prevText = currentText;

              currentText = document.querySelector(
                `div[data-testid='conversation-turn-${responseMessageId}']`
              )?.innerHTML;

              if (currentText && prevText === currentText) {
                clearInterval(interval);

                resolve(currentText);
              }
            }, 3000);
          });
        };

        return getHTML();
      },
      {
        responseMessageId,
      }
    );

    responseMessageId += 2;

    const answer = convert(response, HTML_TO_TEXT_OPTIONS)
      .replace(PREPAND, "")
      .trim();

    history.push({
      role: Role.ASSISTANT,
      content: answer,
    });

    return answer;
  };

  const close = async (): Promise<void> => {
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

const close = async (): Promise<void> => {
  await pptr.close();
};

export { init, singleMessage, createChat, close };