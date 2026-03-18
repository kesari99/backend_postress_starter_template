import express from 'express';
import * as controller from '../controllers/email.controller';
import { clearEmailQueue } from '../services/clearqueue.service';

const router = express.Router();

router.post('/emails', controller.scheduleEmail);
router.get('/emails/:id', controller.getEmailStatus);
router.get('/emails', controller.listEmailJobs);
router.delete('/emails/clear', clearEmailQueue);

export default router;

