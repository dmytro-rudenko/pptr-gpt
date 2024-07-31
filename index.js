#!/usr/bin/env node
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
const command_line_args_1 = __importDefault(require("command-line-args"));
const server_1 = __importDefault(require("./server"));
const client_1 = __importDefault(require("./client"));
const optionDefinitions = [
    { name: "serve", alias: "s", type: Boolean },
    { name: "port", alias: "p", type: Number },
    { name: "help", alias: "h", type: Boolean },
    { name: "no-headless", type: Boolean, defaultValue: false },
];
const options = (0, command_line_args_1.default)(optionDefinitions);
if (options.serve) {
    const port = Number(options.port) || 3000;
    (0, server_1.default)({ port, headless: !options['no-headless'] });
}
if (options.help) {
    console.log(`
    Usage: pptr-gpt [options]

    Options:
    -s, --serve         Start the server
    -p, --port          Set the port for the server
    -h, --help          Display help
    --no-headless       Run the browser in headful mode
    `);
}
module.exports = client_1.default;
