const HOST =  "localhost:3000"

const test = async () => {
    const ask = await fetch(`http://${HOST}/ask`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            question: "What is the meaning of life?",
        }),
    })

    const answer = await ask.json()

    console.log('answer', answer)

    const ask2 = await fetch(`http://${HOST}/ask`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            question: "Who is the creator of puppeteer?",
        }),
    })

    const answer2 = await ask2.json()

    console.log('answer2', answer2)

    const createChat = await fetch(`http://${HOST}/create-chat`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            message: "Create a story about dog, coder and nuclear bomb",
        }),
    })

    const chat = await createChat.json()

    console.log('chat', chat)

    const sendMessage = await fetch(`http://${HOST}/chat/send-message`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            id: chat.id,
            message: "It must be in Philip Dick's style",
        }),
    })

    const message = await sendMessage.json()

    console.log('message', message)

    const nextMessage = await fetch(`http://${HOST}/chat/send-message`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            id: chat.id,
            message: "Translate it to ukrainian",
        }),
    })

    const nextMessage2 = await nextMessage.json()

    console.log('nextMessage2', nextMessage2)
}

test()