#!/usr/bin/env node

import server from "./server";
import client from "./client";

const isInitServe = process.argv[2] === "serve";

if (isInitServe) {
    const port = Number(process.argv[3]) || 3000;

    server(port);
}

export default client