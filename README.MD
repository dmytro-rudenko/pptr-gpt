## PPTR-GPT - Node.js ChatGPT Module

This Node.js module allows you to interact with the ChatGPT website(https://chat.openai.com) using Puppeteer. It enables you to send messages to ChatGPT and receive responses, as well as create conversational sessions with the ability to send multiple messages and retrieve the conversation history.

### Installation
To install the module, run the following command:

```bash
npm install pptr-gpt
```

### Usage
First, import the required functions from the module:

```javascript
const chatGpt = require('pptr-gpt');
```

### Initialization
Before using the module, you need to initialize Puppeteer:

```javascript
await chatGpt.init()
```

### Single message
To send a single message to ChatGPT and receive the response, use the `singleMessage` function:

```javascript
const answer = await chatGpt.singleMessage(`Write a story about dog, software engineer, and node.js`);
console.log(answer);
```

### Create Chat Session

To create a conversational session with ChatGPT, use the `createChat` function:

```javascript
const chat = await chatGpt.createChat("How to write a todo app on node.js?");
console.log(chat.response);
```

The `createChat` function returns an object with the following properties and methods:
- `response` (string): The initial response from ChatGPT.
- `history` (array): An array containing the conversation history, with each element representing a message exchange between the user and ChatGPT.
- `send` (function): A function that allows you to send additional messages to ChatGPT during the conversation. It returns a Promise that resolves with the response from ChatGPT.
- `close` (function): A function that closes the current chat session.

Example of sending additional messages:

```javascript
const nextResponse = await chat.send("Ok. And how to write this on python?");
console.log(nextResponse);
console.log('history', chat.history);
```

### Closing Sessions
After you're done using the module, you should close the Puppeteer session:

```javascript
await chatGpt.close();
```

### Example

Here's a complete example that demonstrates the usage of the module:

```javascript
const chatGpt = require('pptr-gpt');

const test = async () => {
  await chatGpt.init();

  const answer = await chatGpt.singleMessage(`Write a story about dog, software engineer, and node.js`);
  console.log("---Single Message---");
  console.log(answer)
  console.log("--------------------");

  const chat = await chatGpt.createChat("How to write a todo app on node.js?");
  console.log("----Create Chat-----");
  console.log(chat.response);
  console.log("--------------------");

  const nextResponse = await chat.send("Ok. And how to write this on python?");
  console.log("----Next Response----");
  console.log(nextResponse);
  console.log('--------------------');
  console.log('history', chat.history);

  await chat.close();
  await chatGpt.close();
};

test();
```

This example demonstrates the following:

Initializing the module.
Sending a single message to ChatGPT and logging the response.
Creating a chat session and logging the initial response.
Sending an additional message during the chat session and logging the response.
Logging the conversation history.
Closing the chat session and Puppeteer session.