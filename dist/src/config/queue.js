"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const bullmq_1 = require("bullmq");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const emailQueue = new bullmq_1.Queue('email-queue', {
    connection: {
        host: process.env.REDIS_HOST,
        port: parseInt(process.env.REDIS_PORT || '6379')
    }
});
exports.default = emailQueue;
