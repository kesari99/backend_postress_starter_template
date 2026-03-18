import { Worker, Job } from "bullmq";
import db from "../models";
import sendEmail from "../utils/mailer";
import dotenv from "dotenv";
dotenv.config();

const connection = {
  host: process.env.REDIS_HOST,
  port: Number(process.env.REDIS_PORT || 6379),
};

const worker = new Worker(
  "email-queue",
  async (job: Job) => {
    // Use ID from data payload (preferred) or fallback to job.id (legacy/risky)
    const dbJobId = job.data.id ? Number(job.data.id) : Number(job.id);
    const jobData = job.data;

    try {
      await db.EmailJobs.update(
        {
          status: "active",
        },
        {
          where: { id: dbJobId },
        }
      );

      await sendEmail(jobData.to_address, jobData.subject, jobData.body);

      await db.EmailJobs.update(
        {
          status: "completed",
          result: "Sent successfully",
        },
        {
          where: { id: dbJobId },
        }
      );

      console.log(`Email sent successfully to ${jobData.to_address}`);
    } catch (error: any) {
      console.error(`Failed to send email to ${jobData.to_address}:`, error.message);

      await db.EmailJobs.update(
        {
          status: "failed",
          error: error.message,
          attempts: job.attemptsMade,
        },
        { where: { id: dbJobId } }
      );
      throw error;
    }
  },
  { connection }
);

export default worker;

