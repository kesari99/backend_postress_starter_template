import { Request, Response } from 'express';
import db from "../models";
import scheduleEmailJob from "../services/email.service";

export const scheduleEmail = async (req: Request, res: Response) => {
  const { to_address, subject, body } = req.body;
  if (!to_address || !subject || !body) {
    return res.status(400).json({ error: "Missing fields" });
  }

  const jobId = await scheduleEmailJob({ to_address, subject, body });
  res.status(201).json({ jobId });
};

export const getEmailStatus = async (req: Request, res: Response) => {
  const job = await db.EmailJobs.findByPk(req.params.id);
  if (!job) return res.status(404).json({ error: "Job not found" });

  res.json(job);
};

export const listEmailJobs = async (req: Request, res: Response) => {
  const jobs = await db.EmailJobs.findAll();
  res.json(jobs);
};

