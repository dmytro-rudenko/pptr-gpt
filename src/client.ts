import pptr from "./services/puppeteer";
import { convert } from "html-to-text";
import storage from "./services/storage";
import path from "path";
import fs from "fs";

const CHAT_GPT_URL = "https://chat.openai.com";
const PREPAND = "ChatGPT";

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
  
  await page.keyboard.sendCharacter(text).catch((err: any) => {
    console.log(err)
  })
  await page.click("button[data-testid='fruitjuice-send-button']"); 
};

const init = async (options: {
  headless?: boolean;
  screenshots?: boolean;
}): Promise<void> => {
  const params: {
    headless?: boolean
  } = {}

  if (options.hasOwnProperty('headless')) {
    params.headless = options.headless
  }

  if (options.hasOwnProperty('screenshots')) {
    storage.set('screenshots', String(options.screenshots) as string)

    // create public directory if it doesn't exist
    if (!fs.existsSync(path.join(__dirname, 'public'))) {
      fs.mkdirSync(path.join(__dirname, 'public'));
    }
  }

  await pptr.init(params);
};

const singleMessage = async (text: string): Promise<string> => {
  const page = await pptr.goTo(CHAT_GPT_URL);
  const screenshots = storage.get('screenshots');
  // screenshot
  if (screenshots) {
    await page.screenshot({ path: path.join(__dirname, 'public/screenshot.png') });

  }
  await page.waitForSelector("#prompt-textarea", {
    timeout: 60_000
  });
  await typeClick(page, text);

  if (screenshots) {
    await page.screenshot({ path: path.join(__dirname, 'public/screenshot2.png') });
  }

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
    const screenshots = storage.get('screenshots');
  
    await typeClick(page, message);
  
    if (screenshots) {
      await page.screenshot({ path: path.join(__dirname, `public/screenshot-${responseMessageId + 1}.png`) });
    }

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

  await page.waitForSelector("#prompt-textarea", {
    timeout: 60_000
  });
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

const client = { init, singleMessage, createChat, close };

export = client;