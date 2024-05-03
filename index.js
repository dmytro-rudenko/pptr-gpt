#!/usr/bin/env node
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const command_line_args_1 = __importDefault(require("command-line-args"));
const server_1 = __importDefault(require("./server"));
const client_1 = __importDefault(require("./client"));
const optionDefinitions = [
    { name: "serve", alias: "s", type: Boolean },
    { name: "port", alias: "p", type: Number },
    { name: "help", alias: "h", type: Boolean },
];
const options = (0, command_line_args_1.default)(optionDefinitions);
if (options.serve) {
    const port = Number(options.port) || 3000;
    (0, server_1.default)(port);
}
if (options.help) {
    console.log(`
    Usage: chat-gpt [options]

    Options:
    -s, --serve         Start the server
    -p, --port          Set the port for the server
    -h, --help          Display help
    `);
}
exports.default = client_1.default;
