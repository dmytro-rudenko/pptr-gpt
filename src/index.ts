#!/usr/bin/env node

import commandLineArgs from "command-line-args";
import server from "./server";
import client from "./client";

const optionDefinitions = [
    { name: "serve", alias: "s", type: Boolean },
    { name: "port", alias: "p", type: Number },
    { name: "help", alias: "h", type: Boolean },
];

const options = commandLineArgs(optionDefinitions);

if (options.serve) {
    const port = Number(options.port) || 3000;

    server(port);
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

export = client