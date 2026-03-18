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
const queue_1 = __importDefault(require("../config/queue"));
const models_1 = __importDefault(require("../models"));
function scheduleEmailJob(data) {
    return __awaiter(this, void 0, void 0, function* () {
        const job = yield models_1.default.EmailJobs.create({
            to_address: data.to_address,
            subject: data.subject,
            body: data.body,
            status: 'pending',
            attempts: 0,
            max_attempts: 3
        });
        // Include DB ID in the payload for the worker
        const jobData = {
            id: job.id,
            to_address: data.to_address,
            subject: data.subject,
            body: data.body
        };
        yield queue_1.default.add('send-email', jobData, {
            attempts: 3,
            backoff: {
                type: 'exponential',
                delay: 5000
            },
        });
        return job.id;
    });
}
exports.default = scheduleEmailJob;
