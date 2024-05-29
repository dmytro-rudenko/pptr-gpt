# PPTR-GPT - Node.js ChatGPT Module

This Node.js module allows you to interact with the ChatGPT website (https://chat.openai.com) using Puppeteer. It enables you to send messages to ChatGPT and receive responses, as well as create conversational sessions with the ability to send multiple messages and retrieve the conversation history. Additionally, it can run as a CLI application and a REST API server.

## Installation
To install the module, run the following command:

```bash
npm install pptr-gpt
# or global
npm install pptr-gpt -g
```

## Usage

### CLI Usage
You can run the module as a CLI application. The following options are available:

```bash
Usage: chat-gpt [options]

Options:
-s, --serve         Start the server
-p, --port          Set the port for the server (default: 3000)
-h, --help          Display help
--no-headless       Run the browser in headful mode
```

### Node.js Module Usage
First, import the required functions from the module:

```javascript
const chatGpt = require('pptr-gpt');
```

#### Initialization
Before using the module, you need to initialize Puppeteer:

```javascript
await chatGpt.init();
```

#### Single message
To send a single message to ChatGPT and receive the response, use the `singleMessage` function:

```javascript
const answer = await chatGpt.singleMessage(`Write a story about dog, software engineer, and node.js`);
console.log(answer);
```

#### Create Chat Session
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

#### Closing Sessions
After you're done using the module, you should close the Puppeteer session:

```javascript
await chatGpt.close();
```

### REST API

You can run the module as a REST API server. The following endpoints are available:

#### Start the Server
To start the server, run the following command:

```bash
pptr-gpt -s
# or with a specific port
pptr-gpt -s -p 4000
```

The default port is `3000`.

#### API Endpoints

##### `GET /`
Check if the server is running.

**Response:**
```json
{
    "message": "pptr-gpt api running"
}
```

##### `POST /ask`
Send a single message to ChatGPT.

**Request Body:**
```json
{
    "question": "Your question here"
}
```

**Response:**
```json
{
    "answer": "ChatGPT's response here"
}
```

##### `POST /create-chat`
Create a new chat session with ChatGPT.

**Request Body:**
```json
{
    "message": "Initial message for the chat session"
}
```

**Response:**
```json
{
    "id": "chat-session-id",
    "answer": "Initial response from ChatGPT"
}
```

##### `POST /chat/send-message`
Send a message to an existing chat session.

**Request Body:**
```json
{
    "id": "chat-session-id",
    "message": "Your message here"
}
```

**Response:**
```json
{
    "answer": "ChatGPT's response here"
}
```

##### `GET /chat/:id/close`
Close an existing chat session.

**Response:**
```json
{
    "status": "ok"
}
```

### Example

Here's a complete example that demonstrates the usage of the module:

```javascript
const chatGpt = require('pptr-gpt');

const test = async () => {
  await chatGpt.init();

  const answer = await chatGpt.singleMessage(`Write a story about dog, software engineer, and node.js`);
  console.log("---Single Message---");
  console.log(answer);
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

1. Initializing the module.
2. Sending a single message to ChatGPT and logging the response.
3. Creating a chat session and logging the initial response.
4. Sending an additional message during the chat session and logging the response.
5. Logging the conversation history.
6. Closing the chat session and Puppeteer session.

### REST API Client Example

This example will show you how to interact with the pptr-gpt REST API by sending HTTP requests from a Node.js application.

1. Setup the server (assuming you have already installed pptr-gpt and started the server on port 3000 as described in the previous README):

```bash
pptr-gpt -s -p 3000 --no-headless
```


## License
This project is licensed under the MIT License - see the LICENSE file for details.