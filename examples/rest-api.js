const axios = require('axios');

const apiUrl = 'http://localhost:3000';

const runApiClient = async () => {
  try {
    // Check if the server is running
    const checkResponse = await axios.get(`${apiUrl}/`);
    console.log('Server response:', checkResponse.data);

    // Send a single message to ChatGPT
    const singleMessageResponse = await axios.post(`${apiUrl}/ask`, {
      question: 'Write a story about a dog, software engineer, and Node.js.'
    });
    console.log('Single message response:', singleMessageResponse.data);

    // Create a new chat session
    const createChatResponse = await axios.post(`${apiUrl}/create-chat`, {
      message: 'How to write a todo app in Node.js?'
    });
    const chatId = createChatResponse.data.id;
    console.log('Create chat response:', createChatResponse.data);

    // Send an additional message to the chat session
    const sendMessageResponse = await axios.post(`${apiUrl}/chat/send-message`, {
      id: chatId,
      message: 'Ok. And how to write this in Python?'
    });
    console.log('Send message response:', sendMessageResponse.data);

    // Close the chat session
    const closeChatResponse = await axios.get(`${apiUrl}/chat/${chatId}/close`);
    console.log('Close chat response:', closeChatResponse.data);

  } catch (error) {
    console.error('Error:', error.response ? error.response.data : error.message);
  }
};

runApiClient();
