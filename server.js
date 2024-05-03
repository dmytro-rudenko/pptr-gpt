"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const body_parser_1 = __importDefault(require("body-parser"));
const client_1 = __importDefault(require("./client"));
const morgan_1 = __importDefault(require("morgan"));
const cors_1 = __importDefault(require("cors"));
const uuid_1 = require("uuid");
const server = async (port) => {
    const app = (0, express_1.default)();
    const chats = {};
    app.use(body_parser_1.default.json());
    app.use((0, morgan_1.default)("dev"));
    app.use((0, cors_1.default)({
        origin: "*",
    }));
    await client_1.default.init({
        screenshots: false,
        headless: false,
    });
    app.get("/", (req, res) => {
        res.send("pptr-gpt api running");
    });
    app.post("/ask", async (req, res) => {
        try {
            const { question } = req.body;
            const answer = await client_1.default.singleMessage(question);
            res.json({ answer });
        }
        catch (error) {
            res.status(500).json({ error: "Something went wrong" });
        }
    });
    app.post("/create-chat", async (req, res) => {
        try {
            const { message } = req.body;
            const id = (0, uuid_1.v4)();
            const chat = await client_1.default.createChat(message);
            chats[id] = Object.assign(Object.assign({}, chat), { lastUpdated: Date.now() });
            res.json({ id, answer: chat.response });
        }
        catch (error) {
            res.status(500).json({ error: "Something went wrong" });
        }
    });
    app.post("/chat/send-message", async (req, res) => {
        try {
            const { id, message } = req.body;
            const chat = chats[id];
            if (!chat) {
                return res.status(404).json({ error: "Chat not found" });
            }
            const answer = await chat.send(message);
            chat["lastUpdated"] = Date.now();
            res.json({ answer });
        }
        catch (error) {
            res.status(500).json({ error: "Something went wrong" });
        }
    });
    app.get("/chat/:id/close", async (req, res) => {
        const { id } = req.params;
        const chat = chats[id];
        if (!chat) {
            return res.status(404).json({ error: "Chat not found" });
        }
        await chat.close();
        res.json({ status: "ok" });
    });
    app.listen(port, () => {
        setInterval(async () => {
            console.log("checking chats for closing");
            for (const id in chats) {
                const chat = chats[id];
                if (chat.lastUpdated + 1000 * 60 * 60 * 3 < Date.now()) {
                    console.log("closing chat", id);
                    await chat.close();
                }
            }
        }, 1000 * 60 * 5);
        console.log(`pptr-gpt running on port ${port}`);
    });
    // process on exit
    process.on("SIGINT", async () => {
        await client_1.default.close();
        process.exit();
    });
    process.on("SIGTERM", async () => {
        await client_1.default.close();
        process.exit();
    });
};
exports.default = server;
