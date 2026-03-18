import emailQueue from "../config/queue";
import db from "../models";
import { EmailJobData } from "../types";

async function scheduleEmailJob(data: EmailJobData): Promise<number> {
    const job = await db.EmailJobs.create({
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

    await emailQueue.add('send-email', jobData, {
        attempts: 3,
        backoff: {
            type: 'exponential',
            delay: 5000
        },
    });

    return job.id;
}

export default scheduleEmailJob;

