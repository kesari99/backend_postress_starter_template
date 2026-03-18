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
exports.listEmailJobs = exports.getEmailStatus = exports.scheduleEmail = void 0;
const models_1 = __importDefault(require("../models"));
const email_service_1 = __importDefault(require("../services/email.service"));
const scheduleEmail = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { to_address, subject, body } = req.body;
    if (!to_address || !subject || !body) {
        return res.status(400).json({ error: "Missing fields" });
    }
    const jobId = yield (0, email_service_1.default)({ to_address, subject, body });
    res.status(201).json({ jobId });
});
exports.scheduleEmail = scheduleEmail;
const getEmailStatus = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const job = yield models_1.default.EmailJobs.findByPk(req.params.id);
    if (!job)
        return res.status(404).json({ error: "Job not found" });
    res.json(job);
});
exports.getEmailStatus = getEmailStatus;
const listEmailJobs = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const jobs = yield models_1.default.EmailJobs.findAll();
    res.json(jobs);
});
exports.listEmailJobs = listEmailJobs;
