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