import { Request, Response } from 'express';
import emailQueue from '../config/queue';

export const clearEmailQueue = async (req: Request, res: Response) => {
  try {
    await emailQueue.obliterate({ force: true });
    return res.status(200).json({ message: 'Email queue cleared successfully' });
  } catch (error) {
    console.error('Error clearing queue:', error);
    return res.status(500).json({ error: 'Failed to clear queue' });
  }
};

