"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const bullmq_1 = require("bullmq");
const models_1 = __importDefault(require("../models"));
const mailer_1 = __importDefault(require("../utils/mailer"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const connection = {
    host: process.env.REDIS_HOST,
    port: Number(process.env.REDIS_PORT || 6379),
};
const worker = new bullmq_1.Worker("email-queue", (job) => __awaiter(void 0, void 0, void 0, function* () {
    // Use ID from data payload (preferred) or fallback to job.id (legacy/risky)
    const dbJobId = job.data.id ? Number(job.data.id) : Number(job.id);
    const jobData = job.data;
    try {
        yield models_1.default.EmailJobs.update({
            status: "active",
        }, {
            where: { id: dbJobId },
        });
        yield (0, mailer_1.default)(jobData.to_address, jobData.subject, jobData.body);
        yield models_1.default.EmailJobs.update({
            status: "completed",
            result: "Sent successfully",
        }, {
            where: { id: dbJobId },
        });
        console.log(`Email sent successfully to ${jobData.to_address}`);
    }
    catch (error) {
        console.error(`Failed to send email to ${jobData.to_address}:`, error.message);
        yield models_1.default.EmailJobs.update({
            status: "failed",
            error: error.message,
            attempts: job.attemptsMade,
        }, { where: { id: dbJobId } });
        throw error;
    }
}), { connection });
exports.default = worker;
