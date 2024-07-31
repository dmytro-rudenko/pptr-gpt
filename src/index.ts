#!/usr/bin/env node

import commandLineArgs from "command-line-args";
import server from "./server";
import client from "./client";

const optionDefinitions = [
    { name: "serve", alias: "s", type: Boolean },
    { name: "port", alias: "p", type: Number },
    { name: "help", alias: "h", type: Boolean },
    { name: "no-headless", type: Boolean, defaultValue: false },
];

const options = commandLineArgs(optionDefinitions);

if (options.serve) {
    const port = Number(options.port) || 3000;

    server({ port, headless: !options['no-headless'] });
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

export = client