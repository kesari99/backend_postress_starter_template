import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: parseInt(process.env.EMAIL_PORT || '587'),
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

async function sendEmail(to: string, subject: string, body: string): Promise<void> {
  await transporter.sendMail({
    from: process.env.EMAIL_USER,
    to,
    subject,
    text: body,
  });
}

export default sendEmail;

