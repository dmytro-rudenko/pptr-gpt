declare enum Role {
    USER = "user",
    ASSISTANT = "assistant"
}
interface ChatHistory {
    role: Role;
    content: string;
}
declare const client: {
    init: (options: {
        headless?: boolean;
        screenshots?: boolean;
    }) => Promise<void>;
    singleMessage: (text: string) => Promise<string>;
    createChat: (text: string) => Promise<{
        response: string;
        history: ChatHistory[];
        send: (message: string) => Promise<string>;
        close: () => Promise<void>;
    }>;
    close: () => Promise<void>;
};
export = client;
