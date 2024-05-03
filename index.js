#!/usr/bin/env node
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const server_1 = __importDefault(require("./server"));
const client_1 = __importDefault(require("./client"));
const isInitServe = process.argv[2] === "serve";
if (isInitServe) {
    const port = Number(process.argv[3]) || 3000;
    (0, server_1.default)(port);
}
exports.default = client_1.default;
