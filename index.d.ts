declare enum Role {
    USER = "user",
    ASSISTANT = "assistant"
}
interface ChatHistory {
    role: Role;
    content: string;
}
declare const init: () => Promise<void>;
declare const singleMessage: (text: string) => Promise<string>;
declare const createChat: (text: string) => Promise<{
    response: string;
    history: ChatHistory[];
    send: (message: string) => Promise<string>;
    close: () => Promise<void>;
}>;
declare const close: () => Promise<void>;
export { init, singleMessage, createChat, close };
