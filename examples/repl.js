const readline = require('node:readline/promises');
const chatGpt = require("../index")

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
})

const repl = async () => {
    await chatGpt.init({
        headless: false
    });
    
    const userQuery = await rl.question('You: ');

    const chat = await chatGpt.createChat(userQuery);

    console.log("Assistant:", chat.response);

    const dialog = async () => {
        const userQuery = await rl.question('You: ');
        const nextResponse = await chat.send(userQuery);

        console.log("Assistant:", nextResponse);

        await dialog();
    }

    await dialog();
}

repl()