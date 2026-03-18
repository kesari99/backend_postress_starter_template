"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const email_worker_1 = __importDefault(require("./src/worker/email.worker"));
console.log("Starting email worker...");
email_worker_1.default.on('completed', (job) => {
    console.log(`Job ${job.id} completed successfully`);
});
email_worker_1.default.on('failed', (job, err) => {
    console.error(`Job ${job === null || job === void 0 ? void 0 : job.id} failed:`, err.message);
});
email_worker_1.default.on('error', (err) => {
    console.error('Worker error:', err);
});
console.log("Email worker is running. Press Ctrl+C to stop.");
